
/**
 * All validator here.
 */

var validator = require('validator');
var _ = require('lodash');

validator.extend('empty', function (str) {
    return _.isEmpty(str);
});

validator.extend('notContains', function (str, badString) {
    return !_.contains(str, badString);
});

validator.extend('isEmptyOrURL', function (str) {
    return (_.isEmpty(str) || validator.isURL(str, { protocols: ['http', 'https'], require_protocol: true }));
});

module.exports = validator;
