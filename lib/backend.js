var config = require('config');
var db = require(config.get('librariesDir') + '/models');
var _ = require('lodash');

var QUERY_TYPE_READ = 'read';
var QUERY_TYPE_WRITE = 'write';

fn = {};
fn.getAll = function() {
    this.queryType = QUERY_TYPE_READ;
    return db.Base.findAll();
};

// Creating Backend class
function Backend() {
    this.responseTemplate = {
        success: false,
        data: null,
        error: null,
        errorDev: null
    };
    this.responseCallback = null;
    this.response = null;
    this.queryType = null;
};

Backend.prototype.successCallback = function(_this, data) {
    _this.response = _.clone(_this.responseTemplate);
    _this.response.success = true;
    if (_this.queryType === QUERY_TYPE_READ) {
        _this.response.data = data;
    }
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
    _this.queryType = null;
};

for (var i in fn) {
    if (!fn.hasOwnProperty(i)) continue;
    (function() {
        Backend.prototype[i] = function() {
            var args = arguments;
            args = Array.prototype.slice.call(args, 0).sort();
            this.responseCallback = args.pop();
            var _this = this;
            fn[i].apply(this, args)
                .success(function(data) { _this.successCallback(_this, data) })
                .error(function(error) { _this.errorCallback(_this, error) })
                .done(function() { _this.doneCallback(_this) });
        };
    })();
}

exports = module.exports = new Backend();