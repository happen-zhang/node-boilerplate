

var frontend = require('../controllers/frontend'),
    frontendRoutes;

frontendRoutes = function (app) {
    app.get('/', frontend.index);
};

module.exports = frontendRoutes;
