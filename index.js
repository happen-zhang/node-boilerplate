/**
 * index.js
 */

var http = require('http');
var crypto = require('crypto');
var express = require('express');
var hbs = require('express-hbs');

// helpers
var helpers = require('./helpers');
// routes
var routes = require('./routes');

// json
var packageInfo = require('./package.json');

// express
var app = express();
// 静态文件目录
var staticDir = __dirname + '/public/';
// 视图文件目录
var viewsDir = __dirname + '/views/';
// favicon
var faviconPath = staticDir + 'favicon.ico';

/**
 * setting
 */

app.set('port', 3000);
app.set('views', viewsDir);

/**
 * midware
 */

// static assets
app.use(express.static(staticDir));
// favicon
app.use(express.favicon(faviconPath));
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
    partialsDir: __dirname + '/views/partials'
}));
app.set('view engine', 'hbs');
app.set('views', viewsDir);

/**
 * helper
 */

var assetHash = (crypto.createHash('md5')
                       .update(packageInfo.version + Date.now())
                       .digest('hex'))
                       .substring(0, 10);
helpers.loadCoreHelpers(null, assetHash);

// 路由
routes.frontend(app);
routes.admin(app);

// 开发环境
if ('development' == app.get('env')) {
    app.use(express.errorHandler({
        dumpExceptions: true,
        showStack: true
    }));
}

// 生产环境
if ('production' == app.get('env')) {
    // 404
    app.use(function handleNotFound(req, res) {
        route.handleNotFound(req, res);
    });

    // 500
    app.use(function handlerError(err, req, res, next) {
        route.handleNotFound(err, req, res, next);
    });

    // 视图缓存
    app.set('view cache', true);
}

// 启动服务
http.createServer(app).listen(app.get('port'), function () {
    console.log("Express server listening on port " + app.get('port'));
});
