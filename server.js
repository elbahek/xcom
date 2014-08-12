// Express
var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.engine('html', require('ejs').renderFile);
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Init config
var config = require('config');

// Init routing
require(config.get('librariesDir') +'/router').init(app, express);

app.listen(3000);
