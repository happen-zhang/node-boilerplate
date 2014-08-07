
var _ = require('lodash');

var schema = require('../schema').tables;
var autocompleter = require('./autocompleter');

var autocomplete = null;
var complete = null;

/**
 * 自动完成数据的填充和过滤
 * @param  {String} tableName 数据表名称
 * @param  {Object} model     模型数据
 * @return {Object}           自动完成过的模型数据
 */
autocomplete = function(tableName, model) {
    var columns = _.keys(schema[tableName]);
    var on = Object.prototype.hasOwnProperty.call(model, 'id') ? 'update' : 'add';

    _.each(columns, function(columKey) {
        var field = schema[tableName][columKey];
        if (field.hasOwnProperty('autocompletions')) {
            model[columKey] = complete(model[columKey], field.autocompletions, on);
        }
    }, this);

    return model;
};

/**
 * 自动完成
 * @param  {String} value       模型数据的value
 * @param  {Object} completions 自动完成器
 * @param  {String} on          验证时机，add或update
 * @return {String}             处理后的值
 */
complete = function(value, completions, on) {
    _.each(completions, function(opts, name) {
        if (!opts.hasOwnProperty('autocompleteOn') || (opts.hasOwnProperty('autocompleteOn') && opts.autocompleteOn.toLowerCase() === on)) {
            var args = [];
            if (completions[name].hasOwnProperty('arguments')) {
                args.push(completions[name].arguments);
            }

            args.unshift(value);
            value = autocompleter[name].apply(autocompleter, args);
        }
    }, this);

    return value;
};

module.exports = {
    autocomplete: autocomplete
};
