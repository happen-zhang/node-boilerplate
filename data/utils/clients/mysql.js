
var _ = require('lodash');

var config = require('../../../config');

function doRawAndFlatten(query, flattenFn) {
    return config().database.knex.raw(query).then(function (response) {
        return _.flatten(flattenFn(response));
    });
};

function getTables() {
    return doRawAndFlatten('show tables', function (response) {
        return _.map(response[0], function(entry) {
            return _.values(entry);
        });
    });
};

function getIndexes(table) {
    return doRawAndFlatten('SHOW INDEXES FROM ' + table, function (response) {
        return _.pluck(response[0], 'Key_name');
    });
};

function getColumns(table) {
    return doRawAndFlatten('SHOW COLUMNS FROM ' + table, function (response) {
        return _.pluck(response[0], 'Field');
    });
};

module.exports = {
    getTables:  getTables,
    getIndexes: getIndexes,
    getColumns: getColumns
};
