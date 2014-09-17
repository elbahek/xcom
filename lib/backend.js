var fn = {};

// Creating Backend class
function Backend() {
    this.results = [];
};

for (var i in fn) {
    (function(i) {
        if (fn.hasOwnProperty(i) ) {
            Backend.prototype[i] = function() {
                var args = Array.prototype.slice.call(arguments);
                return fn[i].apply(this, args);
            };
        }
    })(i);
}

exports = module.exports = new Backend();