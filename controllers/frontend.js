
/**
 * Main controller for frontend
 */

var errors = require('../errors');
var frontendControllers;

frontendControllers = {

    index: function(req, res, next) {
        res.render('index', { title: 'Hello World!' });
    },

    geterror: function(req, res, next) {
        errors.error404(req, res, next);
    }

};

module.exports = frontendControllers;
