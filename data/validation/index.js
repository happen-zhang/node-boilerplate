
var _ = require('lodash');
var when = require('when');

var validator = require('./validator');
var schema = require('../schema').tables;
var errors = require('../../errors');

var validateSchema = null;
var validate = null;

/**
 * 模型属性值验证
 * @param  {String}  tableName 数据表名称
 * @param  {String}  model     模型JSON数据
 * @return {Promise}
 */
validateSchema = function(tableName, model) {
    var columns = _.keys(schema[tableName]);
    var validationErrors = [];
    var on = model.hasOwnProperty('id') ? 'update' : 'add';

    // 数据表字段名
    _.each(columns, function (columnKey) {
        var message = '';

        // 检查字段是否可以为空
        if (model.hasOwnProperty(columnKey) && schema[tableName][columnKey].hasOwnProperty('nullable')
                && schema[tableName][columnKey].nullable !== true) {
            if (validator.isNull(model[columnKey]) || validator.empty(model[columnKey])) {
                message = 'Value in [' + tableName + '.' + columnKey + '] cannot be blank.';
                validationErrors.push(new errors.ValidationError(message, tableName + '.' + columnKey));
            }
        }

        // 对非空属性值的检验
        if (model[columnKey] !== null && model[columnKey] !== undefined) {
            // 检查长度是否合法
            if (schema[tableName][columnKey].hasOwnProperty('maxlength')) {
                if (!validator.isLength(model[columnKey], 0, schema[tableName][columnKey].maxlength)) {
                    message = 'Value in [' + tableName + '.' + columnKey + '] exceeds maximum length of '
                        + schema[tableName][columnKey].maxlength + ' characters.';
                    validationErrors.push(new errors.ValidationError(message, tableName + '.' + columnKey));
                }
            }

            // 检查validatations对象
            if (schema[tableName][columnKey].hasOwnProperty('validations')) {
                validationErrors = validationErrors.concat(validate(model[columnKey], columnKey, schema[tableName][columnKey].validations, on));
            }

            // 检查是否为整数
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

/**
 * 字段验证器
 * @param  {String} value       需要被验证属性的value
 * @param  {String} key         需要被验证属性的key
 * @param  {String} on          属性被验证的时机
 * @param  {String} validations 验证器名称
 * @return {Array}              ValidationError的数组
 */
validate = function (value, key, validations, on) {
    var validationErrors = [];

    _.each(validations, function (opts, validationName) {
        // 是否在合适的验证时机
        if (!opts.hasOwnProperty('validateOn') || (opts.hasOwnProperty('validateOn') && opts.validateOn.toLowerCase() === on)) {
            var expect = true;
            var errorInfo = opts.errorInfo || 'Validation (' + validationName + ') failed for ' + key;

            if (_.isBoolean(opts.condition)) {
                expect = opts.condition;
                opts.condition = [];
            } else if (!_.isArray(opts.condition)) {
                opts.condition = [opts.condition];
            }

            opts.condition.unshift(value);

            // 调用validator.xxxx进行验证
            if (validator[validationName].apply(validator, opts.condition) !== expect) {
                validationErrors.push(new errors.ValidationError(errorInfo, key));
            }

            opts.condition.shift();
        }
    }, this);

    return validationErrors;
};

module.exports = {
    validateSchema: validateSchema
};
