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
    
    // --- backend ---
    var backend = require(config.get('librariesDir') + '/backend');

    app.post('/backend/all', function(req, res) {
        backend.getAll(function(dbResponse) {
            res.json(dbResponse);
        });
    });
    app.post('/backend/set-current-datetime', function(req, res) {
        backend.setCurrentDatetime(req.body, function(dbResponse) {
            res.json(dbResponse);
        });
    });

    // Static routes
    app.use('/public', express.static(config.get('publicDir')));

};