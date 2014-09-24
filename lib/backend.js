var config = require('config');
var db = require(config.get('librariesDir') + '/models');
var _ = require('lodash');
var moment = require('moment');

var  ROLE_PUBLIC = 'public'
    ,ROLE_PLAYER = 'player'
    ,ROLE_MASTER = 'master';

fn = {};
fn.getAll = function() {
    return db.Sequelize.Promise.join(
        db.Base.findAll(),
        db.Variable.findAll(),
        db.Permission.findAll(),
        function(bases, variables, rawPermissions) {
            if (bases.length === 0 || variables.length === 0 || rawPermissions.length === 0) {
                return db.Sequelize.Promise.reject();
            }
            var permissions = prepareRawPermissions(rawPermissions);
            if (Object.keys(permissions).length === 0) return db.Sequelize.Promise.reject();

            var data = {
                bases: bases,
                variables: variables,
                permissions: permissions
            };
            return db.Sequelize.Promise.resolve(data);
        }
    );
};
fn.setCurrentDatetime = function(changeDatetimeParams) {
    this.error = 'Cannot set current datetime';
    var operationIsCorrect = changeDatetimeParams.operation !== undefined && ['add', 'subtract'].indexOf(changeDatetimeParams.operation) !== -1;
    var unitIsCorrect = changeDatetimeParams.unit !== undefined && ['days', 'hours', 'minutes'].indexOf(changeDatetimeParams.unit) !== -1;
    var numIsCorrect = changeDatetimeParams.num !== undefined && parseInt(changeDatetimeParams.num) !== NaN;
    if (!operationIsCorrect || !unitIsCorrect || !numIsCorrect) {
        return db.Sequelize.Promise.reject();
    }
    return db.Variable.find('currentDateTime')
        .success(function(dateTime) {
            if (dateTime === null) return db.Sequelize.Promise.reject();
            var currentDateTime = moment(dateTime.value).utc();
            currentDateTime[changeDatetimeParams.operation](parseInt(changeDatetimeParams.num), changeDatetimeParams.unit);
            dateTime.value = currentDateTime.format('YYYY-MM-DD HH:mmZ'); // 2010-07-01 10:30+00:00
            return dateTime.save()
                .success(function() {
                    return db.Sequelize.Promise.resolve(dateTime);
                });
        });
}

// Creating Backend class
function Backend() {
    this.responseTemplate = {
        success: false,
        data: null,
        error: null,
        errorDev: null
    };
    this.error = null;
    this.responseCallback = null;
    this.response = null;
};

Backend.prototype.successCallback = function(_this, data) {
    _this.response = _.clone(_this.responseTemplate);
    _this.response.success = true;
    _this.response.data = data;
};

Backend.prototype.errorCallback = function(_this, error) {
    _this.response = _.clone(_this.responseTemplate);
    _this.response.error = _this.error;
    if (process.env.NODE_ENV === 'development') {
        _this.response.errorDev = error;
    }
}

Backend.prototype.doneCallback = function(_this) {
    _this.responseCallback(_this.response);
    _this.responseCallback = null;
    _this.response = null;
    _this.error = null;
};

function wrap(fn, i) {
    return function() {
        var args = arguments;
        args = Array.prototype.slice.call(args, 0).sort();
        this.responseCallback = args.pop();
        var _this = this;
        fn[i].apply(this, args)
            .success(function(data) { _this.successCallback(_this, data) })
            .error(function(error) { _this.errorCallback(_this, error) })
            .done(function() { _this.doneCallback(_this) });
    };
};

function prepareRawPermissions(rawPermissions) {
    // detect user role
    // var role = 'public';
    // var role = 'player';
    var role = 'master';
    var permissions = {};
    for (var i in rawPermissions) {
        if ([ROLE_PUBLIC, ROLE_PLAYER].indexOf(role) !== -1) {
            permissions[rawPermissions[i].name] = rawPermissions[i][role];
        }
        if (role === ROLE_MASTER) {
            permissions[rawPermissions[i].name] = true;
        }
    }

    return permissions;
};

for (var i in fn) {
    if (!fn.hasOwnProperty(i)) continue;
    Backend.prototype[i] = wrap(fn, i);
}

exports = module.exports = new Backend();