var app = angular.module('xcom');

app.factory('helpersFactory', [function() {
    return {
        extendDeep: function(dst) {
            var _this = this;
            angular.forEach(arguments, function(obj) {
                if (obj !== dst) {
                    angular.forEach(obj, function(value, key) {
                        if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                            _this.extendDeep(dst[key], value);
                        } else {
                            dst[key] = value;
                        }
                    });
                }
            });
            return dst;
        },
        convertToCssCase: function(rawString) {
            return rawString.replace(/[A-Z]/g, function(match) {
                return '-' + match.toLowerCase();
            });
        }
    };
}]);