

var admin = require('../controllers/admin'),
    adminRoutes;

adminRoutes = function (app) {
    app.get('/admin/', admin.index);
};

module.exports = adminRoutes;
