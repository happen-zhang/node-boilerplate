
/**
 * All autocompleter here.
 */

var autocompleter = null;

autocompleter = {

    timestamp: function(value) {
        return new Date().getTime() / 1000;
    },

    concat: function(value, subfix) {
        return value + subfix;
    }
};

module.exports = autocompleter;
