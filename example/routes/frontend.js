

var frontend = require('../controllers/frontend'),
    frontendRoutes;

frontendRoutes = function (app) {
    app.get('/', frontend.index);

    app.get('/findAll', frontend.findAll);
    app.get('/findById', frontend.findById);
    app.get('/add', frontend.add);
    app.get('/editById', frontend.editById);
    app.get('/destroyById', frontend.destroyById);

    app.get('/geterror', frontend.geterror);
    app.get('/getconfig', frontend.getconfig);
};

module.exports = frontendRoutes;
