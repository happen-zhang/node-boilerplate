
/**
 * All autocompleter here.
 */

var uuid = require('node-uuid');

var autocompleter = {

    uuid: function() {
        return uuid.v4();
    },

    timestamp: function(value) {
        return new Date().getTime() / 1000;
    },

    getCurrentUserId: function() {
        return parseInt(Math.random() * 1000);
    }
};

module.exports = autocompleter;
