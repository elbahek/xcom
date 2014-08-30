exports.init = function(app, express) {
    var config = require('config');

    // App entry point
    var assets = require(config.get('librariesDir') +'/assets');
    app.get('/', function(req, res) {
        res.render(config.get('publicDir') +'/views/layout.html', {
            styles: assets.getStyles(),
            scripts: assets.getScripts()
        });
    });
    
    // Static routes
    app.use('/public', express.static(config.get('publicDir')));

};