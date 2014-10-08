var path = require('path');
var siteDir = path.normalize(__dirname + '/..');

module.exports = {
    siteDir: siteDir,
    port: 3000,
    librariesDir: siteDir +'/lib',
    appDir: siteDir +'/app',
    bowerDir: siteDir +'/bower_components',
    publicDir: siteDir +'/public',
    buildDir: siteDir +'/build',
    xcomModuleDir: siteDir +'/app/xcom',
    db: {
        path: siteDir +'/db/xcom.db3'
    },
};