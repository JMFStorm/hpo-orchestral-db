import { Response, Request, NextFunction } from "express";

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  const response = {
    statusCode: err.statusCode ?? 500,
    message: err.message ?? "Unexpected server error",
  };
  return res.status(response.statusCode).json({ error: response });
};

export default errorHandler;
