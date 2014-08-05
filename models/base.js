
/**
 * Base models here.
 */

var bookshelf = require('bookshelf');
var uuid = require('node-uuid');
var moment = require('moment');
var _ = require('lodash');
var when = require('when');

var schema = require('../data/schema');
var validation = require('../data/validation');
var config = require('../config');

// 实例化一个bookshelf对象
var baseBookshelf = bookshelf(config().database.knex);
baseBookshelf.plugin('registry');

baseBookshelf.Model = baseBookshelf.Model.extend({
    // 时间戳为true时，则数据表中需要有created_at和updated_at字段
    hasTimestamps: true,

    // 数据表中的字段
    permittedAttributes: function() {
        return _.keys(schema.tables[this.tableName]);
    },

    // 默认字段值
    defaults: function() {
        return {
            uuid: uuid.v4()
        };
    },

    // 对象初始化
    initialize: function() {
        var self = this;
        var options = arguments[1] || {};

        if (options.include) {
            this.include = _.clone(options.include);
        }

        this.on('creating', this.creating, this);
        this.on('saving', function(model, attributes, options) {
            return when(self.saving(model, attributes, options)).then(function() {
                return self.validate(model, attributes, options);
            });
        });
    },

    // 验证对象中属性的数据
    validate: function() {
        return validation.validateSchema(this.tableName, this.toJSON());
    },

    // 创建数据时触发
    creating: function(newObj, attr, options) {
        console.log('creating...');
    },

    // 保存数据时触发
    saving: function (newObj, attr, options) {
        // 移除所有不属于该模型中的属性
        this.attributes = this.pick(this.permittedAttributes());
        // 保存更新之前的属性
        this._updatedAttributes = newObj.previousAttributes();

        console.log('saving...');
    },

    // 格式化时间日期
    fixDates: function (attrs) {
        var self = this;

        _.each(attrs, function (value, key) {
            if (value !== null && schema.tables[self.tableName][key].type === 'dateTime') {
                attrs[key] = moment(value).toDate();
            }
        });

        return attrs;
    },

    // 格式化整数和布尔型
    fixBools: function (attrs) {
        var self = this;
        _.each(attrs, function (value, key) {
            if (schema.tables[self.tableName][key].type === 'bool') {
                attrs[key] = value ? true : false;
            }
        });

        return attrs;
    },

    // 保存到数据库之前格式化数据
    format: function (attrs) {
        console.log('format...');
        // 格式化日期
        return this.fixDates(attrs);
    },

    // 从数据库中取出数据时，对数据进行格式化
    parse: function (attrs) {
        console.log('parse...');
        return this.fixBools(this.fixDates(attrs));
    },

    // 对象转为json数据
    toJSON: function (options) {
        var attrs = _.extend({}, this.attributes),
            self = this;
        options = options || {};

        if (options && options.shallow) {
            return attrs;
        }

        if (options && options.idOnly) {
            return attrs.id;
        }

        if (options && options.include) {
            this.include = _.union(this.include, options.include);
        }

        _.each(this.relations, function (relation, key) {
            if (key.substring(0, 7) !== '_pivot_') {
                var fullKey = _.isEmpty(options.name) ? key : options.name + '.' + key;
                if (_.contains(self.include, fullKey)) {
                    attrs[key] = relation.toJSON({name: fullKey, include: self.include});
                } else if (relation.hasOwnProperty('length')) {
                    attrs[key] = relation.toJSON({idOnly: true});
                }
            }
        });

        return attrs;
    },

    // 过滤对象的属性值
    sanitize: function (attr) {
        return sanitize(this.get(attr)).xss();
    },

    updatedAttributes: function () {
        return this._updatedAttributes || {};
    },

    updated: function (attr) {
        return this.updatedAttributes()[attr];
    }
}, {

    /**
     * 返回一个可以被每个方法都使用的 options 键值对的key
     * @return {Array} 允许使用的options键值
     */
    permittedOptions: function () {
        return ['context', 'include', 'transacting'];
    },

    /**
     * 过滤不在数据表中出现的属性
     * @param  {Object} data 数据对象
     * @return {Object} 安全的数据对象
     */
    filterData: function (data) {
        var permittedAttributes = this.prototype.permittedAttributes();
        var filteredData = _.pick(data, permittedAttributes);

        return filteredData;
    },

    /**
     * 过滤不可使用的options键值
     * @param  {Object} options    options对象
     * @param  {String} methodName 方法名称
     * @return {Object}            有效的options
     */
    filterOptions: function (options, methodName) {
        var permittedOptions = this.permittedOptions(methodName);
        var filteredOptions = _.pick(options, permittedOptions);

        return filteredOptions;
    },

    /**
     * 得到所有的数据
     * @param  {Object} options options对象
     * @return {Object}         数据集合
     */
    findAll:  function (options) {
        options = this.filterOptions(options, 'findAll');
        return baseBookshelf.Collection.forge([], {model: this}).fetch(options).then(function (result) {
            if (options.include) {
                _.each(result.models, function (item) {
                    item.include = options.include;
                });
            }

            return result;
        });
    },

    /**
     * 按data条件得到指定的数据
     * @param  {Object} data    条件数据
     * @param  {Object} options options数据
     * @return {Object}         数据对象
     */
    findOne: function (data, options) {
        data = this.filterData(data);
        options = this.filterOptions(options, 'findOne');

        return this.forge(data, {include: options.include}).fetch(options);
    },

    /**
     * 按data条件修改指定的数据
     * @param  {Object} data    条件数据
     * @param  {Object} options options数据
     * @return {Object}         数据对象
     */
    edit: function (data, options) {
        var id = options.id;
        data = this.filterData(data);
        options = this.filterOptions(options, 'edit');

        return this.forge({id: id}).fetch(options).then(function (object) {
            if (object) {
                return object.save(data, options);
            }
        });
    },

    /**
     * 按data添加新的数据
     * @param  {Object} data    添加数据
     * @param  {Object} options options数据
     * @return {Object}         数据对象
     */
    add: function (data, options) {
        data = this.filterData(data);
        options = this.filterOptions(options, 'add');
        var instance = this.forge(data);

        // 当数据为导入时，可能出现时间抽一样的问题，所以可以设置时间戳为false
        if (options.importing) {
            instance.hasTimestamps = false;
        }

        return instance.save(null, options);
    },

    /**
     * 按options.id来删除指定的数据
     * @param  {Object} options options.id指定删除的对象
     * @return {NULL}
     */
    destroy: function (options) {
        var id = options.id;
        options = this.filterOptions(options, 'destroy');
        return this.forge({id: id}).destroy(options);
    }
});

module.exports = baseBookshelf;
