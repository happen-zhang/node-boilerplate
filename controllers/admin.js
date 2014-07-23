
/**
 * Main controller for frontend
 */

var adminControllers;

adminControllers = {

    index: function (req, res, next) {
        res.render('index', { title: 'Hello World!' });
    }

};

module.exports = adminControllers;
