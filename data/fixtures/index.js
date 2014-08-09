
var _ = require('lodash');
var when = require('when');

var config = require('../../config');
var fixtures = require('./fixtures.json');

var knex = config().database.knex;

function populate() {
    var promises = [];

    _.each(fixtures, function(sqls) {
        if (_.isArray(sqls)) {
            sqls.forEach(function(sql) {
                promises.push(knex.raw(sql));
            });
        } else {
            promises.push(knex.raw(sqls));
        }
    });

    return when.all(promises);
};

module.exports = {
    populate: populate
};
