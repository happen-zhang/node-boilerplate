
var when = require('when');
var _ = require('lodash');

var config = require('../../config');
var schema = require('../schema').tables;

var dbConfig;

function createTable(table) {
    dbConfig = dbConfig || config().database;

    return dbConfig.knex.schema.createTable(table, function(t) {
        var columnKeys = _.keys(schema[table]);

        _.each(columnKeys, function(column) {
            return addTableColumn(table, t, column);
        });
    });
}

function addTableColumn(tableName, table, columnname) {
    var column;
    var columnSpec = schema[tableName][columnname];

    if (columnSpec.type === 'text' && columnSpec.hasOwnProperty('fieldtype')) {
        // text类型
        column = table[columnSpec.type](columnname, columnSpec.fieldtype);
    } else if (columnSpec.type === 'string') {
        // string 默认长度255
        var length = 255;
        if (columnSpec.hasOwnProperty('maxlength')) {
            length = columnSpec.maxlength;
        }
        column = table[columnSpec.type](columnname, columnSpec.maxlength);
    } else {
        // increments, integer, bigInteger, float, decimal, boolean
        // date, dateTime, time, timestamp, binary, enum / enu
        // json, uuid
        column = table[columnSpec.type](columnname);
    }

    // nullable
    if (columnSpec.hasOwnProperty('nullable') && columnSpec.nullable === true) {
        column.nullable();
    } else {
        column.notNullable();
    }

    // primary
    if (columnSpec.hasOwnProperty('primary') && columnSpec.primary === true) {
        column.primary();
    }

    // unique
    if (columnSpec.hasOwnProperty('unique') && columnSpec.unique) {
        column.unique();
    }

    // unsigned
    if (columnSpec.hasOwnProperty('unsigned') && columnSpec.unsigned) {
        column.unsigned();
    }

    // references
    if (columnSpec.hasOwnProperty('references')) {
        column.references(columnSpec.references);
    }

    // defaultTo
    if (columnSpec.hasOwnProperty('defaultTo')) {
        column.defaultTo(columnSpec.defaultTo);
    }
}

function deleteTable(table) {
    dbConfig = dbConfig || config().database;
    return dbConfig.knex.schema.dropTableIfExists(table);
}

function getTables() {
    dbConfig = dbConfig || config().database;
    var client = dbConfig.client;

    if (_.contains(_.keys(clients), client)) {
        return clients[client].getTables();
    }

    return when.reject('No support for database client ' + client);
}

function getIndexes(table) {
    dbConfig = dbConfig || config().database;
    var client = dbConfig.client;

    if (_.contains(_.keys(clients), client)) {
        return clients[client].getIndexes(table);
    }

    return when.reject('No support for database client ' + client);
}

function getColumns(table) {
    dbConfig = dbConfig || config().database;
    var client = dbConfig.client;

    if (_.contains(_.keys(clients), client)) {
        return clients[client].getColumns(table);
    }

    return when.reject('No support for database client ' + client);
}

function addColumn(table, column) {
    dbConfig = dbConfig || config().database;
    return dbConfig.knex.schema.table(table, function(t) {
        addTableColumn(table, t, column);
    });
}

function addUnique(table, column) {
    dbConfig = dbConfig || config().database;
    return dbConfig.knex.schema.table(table, function (table) {
        table.unique(column);
    });
}

function dropUnique(table, column) {
    dbConfig = dbConfig || config().database;
    return dbConfig.knex.schema.table(table, function (table) {
        table.dropUnique(column);
    });
}

module.exports = {
    createTable: createTable,
    deleteTable: deleteTable,
    getTables: getTables,
    getIndexes: getIndexes,
    addUnique: addUnique,
    dropUnique: dropUnique,
    addColumn: addColumn,
    getColumns: getColumns
};
