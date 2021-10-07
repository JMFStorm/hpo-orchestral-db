const errorHandler = (err, req, res, next) => {
  const response = {
    statusCode: err.statusCode ?? 500,
    message: err.message ?? "Unexpected server error",
  };
  return res.status(response.statusCode).json({ error: response });
};

module.exports = errorHandler;
