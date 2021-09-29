class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
    this.isOperatonal = true;

    Error.captureStackTrace(this, this.contructor);
  }
}

module.exports = AppError;
