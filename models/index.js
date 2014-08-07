
/**
 * All models here.
 */

var models = null;

models = {
    Base: require('./base'),
    Post: require('./post').Post
};

module.exports = models;
