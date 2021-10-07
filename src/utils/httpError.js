const httpError = (message, statusCode) => {
  return {
    statusCode: statusCode,
    message: message,
  };
};

module.exports = httpError;
