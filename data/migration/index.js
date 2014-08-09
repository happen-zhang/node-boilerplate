
var _ = require('lodash');
var sequence = require('when/sequence');

var schema = require('../schema').tables;
var fixtures = require('../fixtures');
var utils = require('../utils');

var schemaTables = _.keys(schema);
var migrationUpFreshDb;
var reset;

migrateUpFreshDb = function() {
    var tables = _.map(schemaTables, function(table) {
        return function() {
            return utils.createTable(table);
        }
    });

    return sequence(tables).then(function() {
        return fixtures.populate();
    });
};

dropTables = function () {
    var tables = _.map(schemaTables, function (table) {
        return function () {
            return utils.deleteTable(table);
        };
    }).reverse();

    return sequence(tables);
};

module.exports = {
    migrateUpFreshDb: migrateUpFreshDb,
    dropTables: dropTables
};
