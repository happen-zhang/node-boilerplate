
/**
 * All config here.
 */

var path = require('path');
var url  = require('url');

var _ = require('lodash');
var knex = require('knex');

var appConfig = {};
var appRoot = path.resolve(__dirname, '../');
var defaultConfigPath = path.resolve(appRoot, 'config/', 'config.js');
var knexInstance;

function updateConfig(config) {
    var localPath;
    var subdir;

    _.merge(appConfig, config);

    appConfig.paths = appConfig.paths || {};

    if (appConfig.url) {
        localPath = url.parse(appConfig.url).path;
        // 去除最后的'/'
        if (localPath !== '/') {
            localPath = localPath.replace(/\/$/, '');
        }
    }

    subdir = (localPath === '/' ? '' : localPath);

    if (!knexInstance && appConfig.database) {
        knexInstance = knex(appConfig.database);
    }

    _.merge(appConfig, {
        database: {
            knex: knexInstance
        },

        paths: {
            'appRoot': appRoot,
            'subdir': subdir,
            'config': appConfig.paths.config || defaultConfigPath,
            'configExample': path.join(appRoot, 'config.example.js'),
            'static': appConfig.paths.config || path.join(appRoot, 'public'),
            'views': appConfig.paths.config || path.join(appRoot, 'views')
        }
    });

    return appConfig;
}

function initConfig(rawConfig) {
    appConfig = updateConfig(rawConfig);

    return appConfig;
}

function config() {
    if (_.isEmpty(appConfig)) {
        try {
            // 尝试加载/config.js
            appConfig = require(defaultConfigPath)[process.env.NODE_ENV] || {};
        } catch (e) {
            // ignore this exception
        }

        appConfig = updateConfig(appConfig);
    }

    return appConfig;
}

module.exports = config;
module.exports.init = initConfig;
