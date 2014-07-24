
var path = require('path');

var config;

config = {
    development: {
        url: 'http://my-blog.com',

        database: {
            client: 'mysql',
            connection: {
                host     : 'localhost',
                user     : 'root',
                password : '',
                database : 'dbname',
                charset  : 'UTF8_GENERAL_CI'
            }
        },

        server: {
            host: '127.0.0.1',
            port: '3000'
        },

        paths: {
            // config your paths
            'static': path.resolve('../', 'public'),
            'views': path.resolve('../', 'views')
        }
    },

    production: {
        url: 'http://my-blog.com',

        // Example mail config
        // mail: {
        //      transport: 'SMTP',
        //      options: {
        //          service: 'Mailgun',
        //          auth: {
        //              user: '', // mailgun username
        //              pass: ''  // mailgun password
        //          }
        //      }
        //  },

        database: {
            client: 'mysql',
            connection: {
                host     : 'localhost',
                user     : 'remote',
                password : 'mypasswd',
                database : 'dbname',
                charset  : 'UTF8_GENERAL_CI'
            }
        },

        server: {
            host: '127.0.0.1',
            port: '3000'
        }
    },

    testing: {
        url: 'http://127.0.0.1:3000',

        database: {
            client: 'mysql',
            connection: {
                host     : 'localhost',
                user     : 'root',
                password : '',
                database : 'dbname',
                charset  : 'UTF8_GENERAL_CI'
            }
        },

        server: {
            host: '127.0.0.1',
            port: '3000'
        },

        logging: false
    }
};

module.exports = config;
