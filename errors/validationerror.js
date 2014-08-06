
function ValidationError(message, offendingProperty) {
    this.message = message;
    this.stack = new Error().stack;
    this.code = 422;

    if (offendingProperty) {
        this.prototype = offendingProperty;
    }

    this.type = this.name;
};

ValidationError.prototype = Object.create(Error.prototype);
ValidationError.prototype.name = 'ValidationError';

module.exports = ValidationError;
