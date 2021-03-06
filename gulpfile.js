var gulp = require('gulp'),
    less = require('gulp-less'),
    minify = require('gulp-minify-css'),
    uglify = require('gulp-uglify'),
    concat = require('gulp-concat'),
    gulpif = require('gulp-if'),
    rimraf = require('gulp-rimraf'),
    jshint = require('gulp-jshint'),
    jshintStylish = require('jshint-stylish'),
    nodemon = require('gulp-nodemon');

var config = require('config'),
    librariesDir = config.get('librariesDir'),
    appDir = config.get('appDir'),
    bowerDir = config.get('bowerDir'),
    publicDir = config.get('publicDir'),
    buildDir = config.get('buildDir'),
    xcomModuleDir = config.get('xcomModuleDir');

try {
    var environment = require(config.get('siteDir') + '/environment.json').value;
    if (['development', 'production'].indexOf(environment) === -1) {
        environment = 'production';
    }
}
catch (e) {
    var environment = 'production';
}

// copy fonts to public fonts dir
gulp.task('copyFonts', function() {
    var fonts = [
        bowerDir + '/bootstrap/fonts/*',
        bowerDir + '/font-awesome/fonts/*',
        appDir + '/assets/fonts/*'
    ];

    return gulp.src(fonts)
        .pipe(gulp.dest(publicDir + '/fonts'));
});

// copy views to public folder
gulp.task('copyViews', function() {
    var views = [
        xcomModuleDir + '/views/**/*.html'
    ];

    return gulp.src(views, { base: xcomModuleDir + '/views' })
        .pipe(gulp.dest(publicDir + '/views'));
});

// copy translations to public folder
gulp.task('copyTranslations', function() {
    var translations = [
        appDir + '/translations/*.json'
    ];

    return gulp.src(translations)
        .pipe(gulp.dest(publicDir + '/translations'));
});

// compile bootstrap less styles and local less styles
gulp.task('compileLess', function() {
    var lessFiles = [
        appDir + '/assets/less/bootstrap.less',
        appDir + '/assets/less/bootstrap-theme.less',
        appDir + '/assets/less/all-local.less'
    ];

    return gulp.src(lessFiles)
        .pipe(less())
        .pipe(gulp.dest(buildDir))
});

// copy compiled and third-party css to public dir (minify on production)
gulp.task('copyCss', [ 'compileLess' ], function() {
    var css = [
        buildDir + '/bootstrap.css',
        buildDir + '/bootstrap-theme.css',
        bowerDir + '/font-awesome/css/font-awesome.css',
        appDir + '/assets/css/digital-dream.css',
        bowerDir + '/angular-bootstrap-colorpicker/css/colorpicker.css',
        bowerDir + '/angular-xeditable/dist/css/xeditable.css',
        buildDir + '/all-local.css'
    ];

    return gulp.src(css)
        .pipe(gulpif(environment === 'production', minify()))
        .pipe(gulpif(environment === 'production', concat('all.min.css')))
        .pipe(gulp.dest(publicDir + '/css'));
});

// copy third-party js to public dir (minify on production)
gulp.task('copyThirdPartyJs', function() {
    var js = [
        bowerDir + '/jquery/dist/jquery.js',
        bowerDir + '/moment/moment.js',
        bowerDir + '/moment/locale/ru.js',
        bowerDir + '/moment-timezone/builds/moment-timezone-with-data-2010-2020.js',
        bowerDir + '/angular/angular.js',
        bowerDir + '/angular-route/angular-route.js',
        bowerDir + '/angular-cookies/angular-cookies.js',
        bowerDir + '/angular-translate/angular-translate.js',
        bowerDir + '/angular-translate-loader-static-files/angular-translate-loader-static-files.js',
        bowerDir + '/angular-translate-storage-cookie/angular-translate-storage-cookie.js',
        bowerDir + '/angular-translate-storage-local/angular-translate-storage-local.js',
        bowerDir + '/angular-bootstrap/ui-bootstrap.js',
        bowerDir + '/angular-bootstrap/ui-bootstrap-tpls.js',
        bowerDir + '/angular-bootstrap-colorpicker/js/bootstrap-colorpicker-module.js',
        bowerDir + '/angular-xeditable/dist/js/xeditable.js',
        bowerDir + '/angular-moment/angular-moment.js'
    ];

    return gulp.src(js, { base: bowerDir })
        .pipe(gulpif(environment === 'production', uglify()))
        .pipe(gulpif(environment === 'production', concat('ext.min.js')))
        .pipe(gulp.dest(publicDir + '/js'));
});


var appJs = [
    xcomModuleDir + '/xcom.js',
    xcomModuleDir + '/services/app-data.js',
    xcomModuleDir + '/services/helpers.js',
    xcomModuleDir + '/controllers/main.js',
    xcomModuleDir + '/controllers/settings.js',
    xcomModuleDir + '/controllers/references.js',
    xcomModuleDir + '/directives/bases-time-controls.js',
    xcomModuleDir + '/directives/reference.js'
];
// copy app js to public dir (minify on production)
gulp.task('copyAppJs', function() {
    return gulp.src(appJs, { base: appDir })
        .pipe(gulpif(environment === 'production', uglify()))
        .pipe(gulpif(environment === 'production', concat('app.min.js')))
        .pipe(gulp.dest(publicDir + '/js'));
});

// check app js with js hint
gulp.task('jshint', function() {
    return gulp.src(appJs)
        .pipe(jshint())
        .pipe(jshint.reporter(jshintStylish));
});

// watch app js for changes and run corresponding tasks
gulp.task('watchJs', function() {
    return gulp.watch(appDir + '/**/*.js', ['jshint', 'copyAppJs'])
});

// watch less for changes and run corresponding tasks
gulp.task('watchLess', function() {
    var styles = [
        appDir + '/assets/less/*.less',
        appDir + '/assets/css/*.css'
    ];
    return gulp.watch(styles, ['copyCss']);
});

// watch fonts for changes and run corresponding tasks
gulp.task('watchFonts', function() {
    return gulp.watch(appDir + '/assets/fonts/*', ['copyFonts']);
});

// watch views for changes and run corresponding tasks
gulp.task('watchViews', function() {
    return gulp.watch(xcomModuleDir + '/views/**/*.html', ['copyViews']);
});

// watch translations for changes and run corresponding tasks
gulp.task('watchTranslations', function() {
    return gulp.watch(appDir + '/translations/*.json', ['copyTranslations']);
});

// remove all files from public dir
gulp.task('rmrf', function() {
    gulp.src(publicDir + '/**/*.*', { read: false })
        .pipe(rimraf());
})

gulp.task('default', [
    'copyFonts',
    'copyViews',
    'copyTranslations',
    'copyCss',
    'copyThirdPartyJs',
    'copyAppJs',
    'jshint',
    'watchViews',
    'watchJs',
    'watchFonts',
    'watchTranslations',
    'watchLess'
], function() {
    nodemon({
        script: 'server.js',
        ext: 'html js less',
        ignore: [ appDir + '/**', buildDir + '/**', bowerDir + '/**', publicDir + '/**' ],
        env: { 'NODE_ENV': environment }
    });
});