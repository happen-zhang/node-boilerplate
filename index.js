/**
 * index.js
 */

var crypto = require('crypto');
var express = require('express');
var hbs = require('express-hbs');
var log4js = require('log4js');

// config
var config = require('./config');
// helpers
var helpers = require('./helpers');
// routes
var routes = require('./routes');
// errors
var errors = require('./errors');

// json
var packageInfo = require('./package.json');

// express
var app = express();

// set application env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
app.set('env', process.env.NODE_ENV);

var appConfig = config();

/**
 * midware
 */

var static = appConfig.paths.static;
var views = appConfig.paths.views;

// static assets
app.use(express.static(static));
// favicon
app.use(express.favicon(static + 'favicon.ico'));
// bodyParser
app.use(express.bodyParser());
// cookieParser
app.use(express.cookieParser());
// session
app.use(express.session({
    secret: "node-boilerplate"
}));
// logger
app.use(express.logger());

/**
 * views
 */

app.engine('hbs', hbs.express3({
    partialsDir: views + '/partials'
}));
app.set('view engine', 'hbs');
app.set('views', views);

/**
 * helper
 */

var assetHash = (crypto.createHash('md5')
                       .update(packageInfo.version + Date.now())
                       .digest('hex'))
                       .substring(0, 10);
helpers.loadCoreHelpers(null, assetHash);

// handle routes
routes.frontend(app);
routes.admin(app);

// development env
if ('development' == app.get('env')) {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
}

// production env
if ('production' == app.get('env')) {
    // 404
    app.use(function handleNotFound(req, res, next) {
        errors.error404(req, res, next);
    });

    // 500
    app.use(function handlerError(err, req, res, next) {
        errors.error500(err, req, res, next);
    });

    // view cache
    app.set('view cache', true);

    // logger support
    log4js.configure({
        appenders: [{
            type: 'console'
        }]
    });
    logger = log4js.getLogger('normal');
    logger.setLevel('INFO');
    app.use(log4js.connectLogger(logger, {
        level: log4js.levels.INFO
    }));
}

// bootstrap server
app.listen(appConfig.server.port, appConfig.server.host, function() {
    console.log('Express server listening on port ' + appConfig.server.port);
});
