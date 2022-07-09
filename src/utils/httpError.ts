export default (message: any, statusCode: number) => {
  return {
    statusCode: statusCode,
    message: message,
  };
};
