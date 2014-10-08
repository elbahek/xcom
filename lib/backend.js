var config = require('config');
var _ = require('lodash');
var async = require('async');
var moment = require('moment');
var sqlite3 = require('sqlite3');
if (process.env.NODE_ENV === 'development') sqlite3.verbose();

var  ROLE_PUBLIC = 'public'
    ,ROLE_PLAYER = 'player'
    ,ROLE_MASTER = 'master';


var fn = {};
fn.getAll = function(responseCallback) {
    var role = ROLE_MASTER;
    this.error = 'Failed to fetch correct start data';
    this.responseCallback = responseCallback;
    var be = this;
    async.parallel([
        function(cb) { be.db.all('SELECT * FROM base', cb); },
        function(cb) { be.db.all('SELECT * FROM variable', cb); },
        function(cb) {
            var permissions = {};
            be.db.each('SELECT * FROM permission', function(error, row) {
                if ([ROLE_PUBLIC, ROLE_PLAYER].indexOf(role) !== -1) {
                    permissions[row.name] = row[role];
                }
                if (role === ROLE_MASTER) {
                    permissions[row.name] = true;
                }
            }, function(error) {
                cb(error, permissions);
            });
        },
        function(cb) {
            var references = [];
            be.db.all(
                'SELECT r.name referenceName, rc.name columnName, rc.`order` columnOrder, rc.options columnOptions, '+
                '    rr.id rowId, rr.`order` rowOrder, rd.id valueId, rd.value '+
                'FROM reference r '+
                'INNER JOIN referenceColumn rc ON r.id = rc.referenceId '+
                'INNER JOIN referenceRow rr ON r.id = rr.referenceId '+
                'INNER JOIN referenceData rd ON rc.id = rd.referenceColumnId AND rr.id = rd.referenceRowId '+
                'ORDER BY rr.`order`, rc.`order`'
            , cb);
        }
    ], function(error, rawResult) {
        var data = {
            bases: rawResult[0],
            variables: rawResult[1],
            permissions: rawResult[2],
            references: rawResult[3]
        };
        var args = [ error, data ];
        be.processResponse.apply(be, args);
    });
};
fn.setCurrentDatetime = function(changeDatetimeParams, responseCallback) {
    this.error = 'Cannot set current datetime';
    this.responseCallback = responseCallback;
    var operationIsCorrect = changeDatetimeParams.operation !== undefined && ['add', 'subtract'].indexOf(changeDatetimeParams.operation) !== -1;
    var unitIsCorrect = changeDatetimeParams.unit !== undefined && ['days', 'hours', 'minutes'].indexOf(changeDatetimeParams.unit) !== -1;
    var numIsCorrect = changeDatetimeParams.num !== undefined && parseInt(changeDatetimeParams.num) !== NaN;
    if (!operationIsCorrect || !unitIsCorrect || !numIsCorrect) {
        return this.processResponse('Incorrect parameters supplied', null);
    }

    var be = this;
    this.db.get('SELECT * FROM variable WHERE name = ?', 'currentDateTime', function(error, row) {
        if (error) be.processResponse(error, null);
        var currentDateTime = moment(row.value).utc();
        currentDateTime[changeDatetimeParams.operation](parseInt(changeDatetimeParams.num), changeDatetimeParams.unit);
        var newValue = currentDateTime.format('YYYY-MM-DD HH:mmZ');
        be.db.run('UPDATE variable SET value = ? WHERE name = ?', newValue, 'currentDateTime', function(error) {
            be.processResponse.apply(be, [ error, { name: 'currentDateTime', value: newValue } ]);
        });
    });
};
fn.saveReferenceItem = function(data, responseCallback) {
    this.error = 'Failed to find validation data';
    this.responseCallback = responseCallback;
    var be = this;
    this.getReferenceColumnData(data.referenceName, data.columnName, function(columnParams) {
        if (!columnParams) be.processResponse.apply(be, [ be.error, null ]);
        var validationResponse = {
            validationSuccess: false,
            validationMessages: []
        };
        var type = columnParams.options.type;
        for (var i in columnParams.validations) {
            if (!columnParams.validations.hasOwnProperty(i)) continue;
            switch (i) {
                case 'required':
                    if (!columnParams.validations.required) break;
                    if (type === 'text' && !data.value) {
                        validationResponse.validationMessages.push('Empty field not allowed');
                    }
                    break;
            }
        }
        if (validationResponse.validationMessages.length === 0) {
            validationResponse.validationSuccess = true;
        }

        if (validationResponse.validationSuccess) {
            var isNew = !data.id;
            if (isNew) {
            }
            else {
                be.db.run('UPDATE referenceData SET value = ? WHERE id = ?', data.value, data.id, function(error) {
                    be.processResponse.apply(be, [ error, validationResponse ]);
                });
            }
        }
        else {
            be.processResponse.apply(be, [ null, validationResponse ]);
        }
    });
};

// Creating Backend class
function Backend() {
    this.writeMethods = [
        'setCurrentDatetime',
        'saveReferenceItem'
    ];
    this.responseTemplate = {
        success: false,
        data: null,
        error: null,
        errorDev: null
    };
    this.error = null;
    this.response = null;
    this.responseCallback = null;
    this.db = null;
};
Backend.prototype.connect = function(fn, i) {
    return function() {
        this.error = null;
        this.response = null;
        this.responseCallback = null;

        var mode = this.writeMethods.indexOf[i] !== -1 ? sqlite3.OPEN_READWRITE : sqlite3.OPEN_READONLY;
        this.db = new sqlite3.Database(config.get('db.path'), mode);

        var args = Array.prototype.slice.call(arguments, 0).sort();
        fn[i].apply(this, args);
    }
}
Backend.prototype.processResponse = function(error, result) {
    var response = _.clone(this.responseTemplate);
    if (!error) {
        response.success = true;
        response.data = result;
    }
    else {
        response.error = this.error;
        if (process.env.NODE_ENV === 'development') response.errorDev = error;
    }
    this.responseCallback(response);
}
Backend.prototype.getReferenceColumnData = function(referenceName, columnName, dataFoundCallback) {
    var defaultOptions = {
        type: 'text'
    };
    var defaultValidations = {
        required: false
    };

    var be = this;
    this.db.get(
        'SELECT rc.name, rc.options, rc.validations '+
        'FROM referenceColumn rc '+
        'INNER JOIN reference r ON rc.referenceId = r.id AND r.name = ? '+
        'WHERE rc.name = ?'
    , referenceName, columnName,
    function(error, row) {
        if (error) be.processResponse(error, null);
        var columnParams = {
            options: (row.options === null ? {} : JSON.parse(row.options)),
            validations: (row.validations === null ? {} : JSON.parse(row.validations))
        }
        _.defaults(columnParams.options, defaultOptions);
        _.defaults(columnParams.validations, defaultValidations);

        dataFoundCallback(columnParams);
    });
};

for (var i in fn) {
    if (!fn.hasOwnProperty(i)) continue;
    Backend.prototype[i] = Backend.prototype.connect(fn, i);
}

exports = module.exports = new Backend();