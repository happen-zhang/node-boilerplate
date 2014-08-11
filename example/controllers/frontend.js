
/**
 * Main controller for frontend
 */

var api = require('../api');
var errors = require('../errors');
var config = require('../config');

var frontendControllers;

frontendControllers = {

    index: function(req, res, next) {
        res.render('index', { title: 'Hello World!' });
    },

    findAll: function(req, res, next) {
        api.posts.findAll().then(function(posts) {
            res.jsonp({ posts: posts });
        }).otherwise(function(err) {
            errors.error500(err, req, res, next);
        });
    },

    findById: function(req, res, next) {
        api.posts.findById(1).then(function(post) {
            res.jsonp({ post: post });
        }).otherwise(function(err) {
            errors.error500(err, req, res, next);
        });
    },

    add: function(req, res, next) {
        var newPost = {
            title: 'my new title.' + (Math.random() * 10000),
            content: (Math.random() * 10000) + ' hello.'
        }

        api.posts.add(newPost).then(function(post) {
            res.jsonp({ post: post });
        }).otherwise(function(err) {
            errors.error500(err, req, res, next);
        });
    },

    editById: function(req, res, next) {
        var newPost = {
            title: 'my new title.' + (Math.random() * 10000),
            content: (Math.random() * 10000) + ' hello.'
        }

        api.posts.editById(newPost, 1).then(function(post) {
            res.jsonp({ post: post });
        }).otherwise(function(err) {
            errors.error500(err, req, res, next);
        });
    },

    destroyById: function(req, res, next) {
        api.posts.destroyById(4).then(function(data) {
            res.jsonp('Destroy id 2 ok.');
        }).otherwise(function(err) {
            errors.error500(err, req, res, next);
        });
    },

    geterror: function(req, res, next) {
        errors.error404(req, res, next);
    },

    getconfig: function(req, res, next) {
        console.log(config());
        res.jsonp({ name: 'happen' });
    }

};

module.exports = frontendControllers;
