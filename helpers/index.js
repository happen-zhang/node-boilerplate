
/**
 * All helpers here.
 * Handlerbars helpers.
 */

var _ = require('lodash');
var hbs = require('express-hbs');

var config = require('../config');

var assetTemplate = _.template('<%= source %>?v=<%= version %>');
var coreHelpers = {};

/**
 * {{asset "images/hi.png"}}
 */
coreHelpers.asset = function (context, options) {
    var output = config().paths.subdir + '/';

    // Get rid of any leading slash on the context
    context = context.replace(/^\//, '');
    output += context;

    if (!context.match(/^favicon\.ico$/)) {
        output = assetTemplate({
            source: output,
            version: coreHelpers.assetHash
        });
    }

    return new hbs.handlebars.SafeString(output);
};

/**
 * block helper：foreach
 */
coreHelpers.foreach = function (context, options) {
    var fn = options.fn;
    var inverse = options.inverse;
    var i = 0;
    var j = 0;
    var columns = options.hash.columns;
    var key;
    var ret = "";
    var data;

    if (options.data) {
        data = hbs.handlebars.createFrame(options.data);
    }

    function setKeys(_data, _i, _j, _columns) {
        if (_i === 0) {
            _data.first = true;
        }

        if (_i === _j - 1) {
            _data.last = true;
        }

        // first post is index zero but still needs to be odd
        if (_i % 2 === 1) {
            _data.even = true;
        } else {
            _data.odd = true;
        }

        if (_i % _columns === 0) {
            _data.rowStart = true;
        } else if (_i % _columns === (_columns - 1)) {
            _data.rowEnd = true;
        }

        return _data;
    }

    if (context && typeof context === 'object') {
        if (context instanceof Array) {
            for (j = context.length; i < j; i += 1) {
                if (data) {
                    data.index = i;
                    data.first = data.rowEnd = data.rowStart = data.last = data.even = data.odd = false;
                    data = setKeys(data, i, j, columns);
                }
                ret = ret + fn(context[i], { data: data });
            }
        } else {
            for (key in context) {
                if (context.hasOwnProperty(key)) {
                    j += 1;
                }
            }
            for (key in context) {
                if (context.hasOwnProperty(key)) {
                    if (data) {
                        data.key = key;
                        data.first = data.rowEnd = data.rowStart = data.last = data.even = data.odd = false;
                        data = setKeys(data, i, j, columns);
                    }
                    ret = ret + fn(context[key], {data: data});
                    i += 1;
                }
            }
        }
    }

    if (i === 0) {
        ret = inverse(this);
    }

    return ret;
};

// Register a handlebars helper for themes
function registerThemeHelper(name, fn) {
    hbs.registerHelper(name, fn);
}

// Register a handlebars helper for admin
function registerAdminHelper(name, fn) {
    coreHelpers.adminHbs.registerHelper(name, fn);
}

registerHelpers = function (adminHbs, assetHash) {
    // Expose hbs instance for admin
    coreHelpers.adminHbs = adminHbs;

    // Store hash for assets
    coreHelpers.assetHash = assetHash;

    // Register frontend helpers
    registerThemeHelper('asset', coreHelpers.asset);

    registerThemeHelper('foreach', coreHelpers.foreach);

    // Register Admin helpers
    // registerAdminHelper('asset', coreHelpers.asset);
};

module.exports = coreHelpers;
module.exports.loadCoreHelpers = registerHelpers;
