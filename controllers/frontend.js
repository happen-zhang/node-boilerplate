
/**
 * Main controller for frontend
 */

var errors = require('../errors');
var config = require('../config');

var frontendControllers;

frontendControllers = {

    index: function(req, res, next) {
        res.render('index', { title: 'Hello World!' });
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
