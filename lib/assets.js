var styles = [
    'http://fonts.googleapis.com/css?family=Open+Sans:normal,bold|Roboto:normal,bold,900&subset=latin,cyrillic',
    '/public/css/bootstrap.css',
    '/public/css/bootstrap-theme.css',
    '/public/css/font-awesome.css',
    '/public/css/colorpicker.css',
    '/public/css/all-local.css'
];

var scripts = [
    '/public/js/angular/angular.js',
    '/public/js/angular-route/angular-route.js',
    '/public/js/angular-cookies/angular-cookies.js',
    '/public/js/angular-translate/angular-translate.js',
    '/public/js/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
    '/public/js/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
    '/public/js/angular-translate-storage-local/angular-translate-storage-local.js',
    '/public/js/angular-bootstrap/ui-bootstrap.js',
    '/public/js/angular-bootstrap/ui-bootstrap-tpls.js',
    '/public/js/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
    '/public/js/xcom/xcom.js'
];

exports.getStyles = function() {
    var output = '';

    if (process.env.NODE_ENV === 'development') {
        for (var i in styles) {
            output += '<link rel="stylesheet" type="text/css" href="'+ styles[i] +'">\n';
        }
    }
    else {
        output += '<link rel="stylesheet" type="text/css" href="http://fonts.googleapis.com/css?family=Open+Sans:normal,bold|Roboto:normal,bold,900&subset=latin,cyrillic">\n';
        output += '<link rel="stylesheet" type="text/css" href="/public/css/all.min.css">\n';
    }

    return output;
};

exports.getScripts = function() {
    var output = '';

    if (process.env.NODE_ENV === 'development') {
        for (var i in scripts) {
            output += '<script type="text/javascript" src="'+ scripts[i] +'"></script>\n';
        }
    }
    else {
        output += '<script type="text/javascript" src="/public/js/ext.min.js"></script>\n';
        output += '<script type="text/javascript" src="/public/js/app.min.js"></script>\n';
    }

    return output;
};