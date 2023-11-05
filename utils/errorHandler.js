class ErrorHandler extends Error {
    statusCode;

    constructor(message, statusCode) {
        super(message)
        this.statusCode = statusCode;
    }
}

module.exports = ErrorHandler