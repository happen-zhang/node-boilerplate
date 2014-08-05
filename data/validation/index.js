

var _ = require('lodash');
var validator = require('validator');
var when      = require('when');

var errors    = require('../../errors');
var schema    = require('../schema').tables;

var validateSchema = null;
var validate = null;

validator.extend('empty', function (str) {
    return _.isEmpty(str);
});

validator.extend('notContains', function (str, badString) {
    return !_.contains(str, badString);
});

validator.extend('isEmptyOrURL', function (str) {
    return (_.isEmpty(str) || validator.isURL(str, { protocols: ['http', 'https'], require_protocol: true }));
});

validateSchema = function(tableName, model) {
    var columns = _.keys(schema[tableName]);
    var validationErrors = [];

    _.each(columns, function (columnKey) {
        var message = '';

        // check nullable
        if (model.hasOwnProperty(columnKey) && schema[tableName][columnKey].hasOwnProperty('nullable')
                && schema[tableName][columnKey].nullable !== true) {
            if (validator.isNull(model[columnKey]) || validator.empty(model[columnKey])) {
                message = 'Value in [' + tableName + '.' + columnKey + '] cannot be blank.';
                validationErrors.push(new errors.ValidationError(message, tableName + '.' + columnKey));
            }
        }

        // TODO: check if mandatory values should be enforced
        if (model[columnKey] !== null && model[columnKey] !== undefined) {
            // check length
            if (schema[tableName][columnKey].hasOwnProperty('maxlength')) {
                if (!validator.isLength(model[columnKey], 0, schema[tableName][columnKey].maxlength)) {
                    message = 'Value in [' + tableName + '.' + columnKey + '] exceeds maximum length of '
                        + schema[tableName][columnKey].maxlength + ' characters.';
                    validationErrors.push(new errors.ValidationError(message, tableName + '.' + columnKey));
                }
            }

            //check validations objects
            if (schema[tableName][columnKey].hasOwnProperty('validations')) {
                validationErrors = validationErrors.concat(validate(model[columnKey], columnKey, schema[tableName][columnKey].validations));
            }

            //check type
            if (schema[tableName][columnKey].hasOwnProperty('type')) {
                if (schema[tableName][columnKey].type === 'integer' && !validator.isInt(model[columnKey])) {
                    message = 'Value in [' + tableName + '.' + columnKey + '] is not an integer.';
                    validationErrors.push(new errors.ValidationError(message, tableName + '.' + columnKey));
                }
            }
        }
    });

    if (validationErrors.length !== 0) {
        return when.reject(validationErrors);
    }

    return when.resolve();
};

validate = function (value, key, validations) {
    var validationErrors = [];

    _.each(validations, function (validationOptions, validationName) {
        var goodResult = true;

        if (_.isBoolean(validationOptions)) {
            goodResult = validationOptions;
            validationOptions = [];
        } else if (!_.isArray(validationOptions)) {
            validationOptions = [validationOptions];
        }

        validationOptions.unshift(value);

        // equivalent of validator.isSomething(option1, option2)
        if (validator[validationName].apply(validator, validationOptions) !== goodResult) {
            validationErrors.push(new errors.ValidationError('Validation (' + validationName + ') failed for ' + key, key));
        }

        validationOptions.shift();
    }, this);

    return validationErrors;
};

module.exports = {
    validateSchema: validateSchema
};
