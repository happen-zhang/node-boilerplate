
var uuid = require('node-uuid');

var baseBookshelf = require('./base');

var Post = null;
var Posts = null;

Post = baseBookshelf.Model.extend({
    tableName: 'posts'
});

Posts = baseBookshelf.Collection.extend({
    model: Post,

    defaults: function() {
        return {
            uuid: uuid.v4(),
            status: 'draft'
        };
    },

    initialize: function() {
        var self = this;

        baseBookshelf.Model.prototype.initialize.apply(this, arguments);

        this.on('saved', function (model, attributes, options) {
            return console.log('Post saved');
        });
    },

    saving: function(newPost, attr, options) {
        options = options || {};

        baseBookshelf.Model.prototype.saving.call(this, newPost, attr, options);

        this.set('title', this.get('title').trim());

        // 其它一些对post属性的处理
    },

    creating: function(newPost, attr, options) {
        baseBookshelf.Model.prototype.creating.call(this, newPage, attr, options);
    },

    // 表关联
    author_id: function() {
        return this.belongsTo('User', 'author_id');
    },

    toJSON: function(options) {
        var attrs = baseBookshelf.Model.prototype.toJSON.call(this, options);

        attrs.author = attrs.author || attrs.author_id;
        delete attrs.author_id;

        return attrs;
    }
}, {

    permittedOptions: function(methodName) {
        var options = baseBookshelf.Model.permittedOptions();
        var validOptions = {
            findAll: ['withRelated'],
            findOne: ['importing', 'withRelated'],
            add: ['importing']
        };

        if (validOptions[methodName]) {
            options = options.concat(validOptions[methodName]);
        }

        return options;
    },

    filterData: function(data) {
        var permittedAttributes = this.prototype.permittedAttributes();
        var filteredData;

        filteredData = _.pick(data, permittedAttributes);

        return filteredData;
    },

    findAll: function(options) {
        options = options || {};
        return baseBookshelf.Model.findAll.call(this, options);
    },

    findOne: function(data, options) {
        options = options || {};

        data = _.extend({
            status: 'published'
        }, data || {});

        return ghostBookshelf.Model.findOne.call(this, data, options);
    },

    add: function(data, options) {
        var self = this;
        options = options || {};

        return ghostBookshelf.Model.add.call(this, data, options).then(function (post) {
            return self.findOne({id: post.id}, options);
        });
    },

    edit: function(data, options) {
        return baseBookshelf.Model.edit.call(this, data, options);
    },

    destroy: function(options) {
        return baseBookshelf.Model.destroy.call(this, options);
    }
});

module.exports = {
    Post: baseBookshelf.model('Post', Post),
    Posts: baseBookshelf.collection('Posts', Posts)
};
