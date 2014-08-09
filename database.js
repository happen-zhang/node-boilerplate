
// set application env
process.env.NODE_ENV = process.env.NODE_ENV || 'development';

var minimist = require('minimist');
var inquirer = require('inquirer');

var config = require('./config');
var migration = require('./data/migration');

var argv = minimist(process.argv.slice(2));
var kenxInstance;

if (process.argv.length === 2) {
    process.exit(0);
}

// 初始化配置
(function() {
    config();
})();

if (argv.hasOwnProperty('install')) {
    var question = getQuestion('Are you sure to install database?');

    responseTrue(question, function() {
        // 初始化数据库
        console.log('installing database...');
        return migration.migrateUpFreshDb().then(function() {
            console.log('install database success.');
        }).catch(function(errors) {
            console.log(errors);
            console.log('install database failure.');
        });
    });
} else if (argv.hasOwnProperty('reset')) {
    var question = getQuestion('Are you sure to reset database?');

    responseTrue(question, function() {
        // 重置数据库
        console.log('reseting database...');
        return migration.dropTables().then(function(data) {
            console.log('deleting database...');
            return migration.migrateUpFreshDb();
        }).then(function() {
            console.log('reset successful.');
        }).catch(function(errors) {
            console.log(errors);
            console.log('reset database failure.');
        });
    });
} else if (argv.hasOwnProperty('uninstall')) {
    var question = getQuestion('Are you sure to uninstall database?');

    responseTrue(question, function() {
        // 删除数据库
        console.log('droping tables...');
        return dropTables().then(function() {
            console.log('droping tables success.');
        }).catch(function(errors) {
            console.log(errors);
            console.log('uninstall database failure.');
        });
    });
} else {
    process.exit(0);
}

function getQuestion(str) {
    return {
        name: 'confirm',
        message: str,
        default: false
    };
}

function responseTrue(question, callback) {
    inquirer.prompt(question, function(answers) {
        if (answers.confirm === 'true') {
            callback().finally(function() {
                process.exit(0);
            });
        } else {
            process.exit(0);
        }
    });
}
