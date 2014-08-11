
var when = require('when');

var models = require('../models');
var errors = require('../errors');

var posts = {

    findAll: function(options) {
        return models.Post.findAll().then(function(posts) {
            if (posts) {
                return posts.toJSON();
            }

            return when.reject(new errors.NotFoundError('Post not found.'));
        });
    },

    findById: function(id) {
        return models.Post.findOne({id: id}).then(function(post) {
            if (post) {
                return post.toJSON();
            }

            return when.reject(new errors.NotFoundError('Post not found.'));
        });
    },

    add: function(data, options) {
        return models.Post.add(data, options).then(function(post) {
            if (post) {
                return post.toJSON();
            }

            return when.reject('Failed to add a post.');
        });
    },

    editById: function(data, id) {
        return models.Post.edit(data, {id: id}).then(function(post) {
            if (post) {
                return post.toJSON();
            }

            return when.reject(new errors.NotFoundError('Post not found.'));
        });
    },

    destroyById: function(id) {
        return models.Post.destroy({id: id});
    }
};

module.exports = posts;
