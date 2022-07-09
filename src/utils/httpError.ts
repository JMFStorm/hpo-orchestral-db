const httpError = (message: any, statusCode: number) => {
  return {
    statusCode: statusCode,
    message: message,
  };
};

module.exports = httpError;
