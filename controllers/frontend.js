
/**
 * Main controller for frontend
 */

var frontendControllers;

frontendControllers = {

    index: function (req, res, next) {
        res.render('index', { title: 'Hello World!' });
    }

};

module.exports = frontendControllers;
