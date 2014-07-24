

var frontend = require('../controllers/frontend'),
    frontendRoutes;

frontendRoutes = function (app) {
    app.get('/', frontend.index);
    app.get('/geterror', frontend.geterror);
    app.get('/getconfig', frontend.getconfig);
};

module.exports = frontendRoutes;
