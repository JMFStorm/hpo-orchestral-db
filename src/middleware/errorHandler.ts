import { Response, Request, NextFunction } from "express";

import { HttpErrorType } from "../utils/httpError";

const instanceOfHttpError = (object: any): object is HttpErrorType =>
  "errorObjects" in object && "statusCode" in object;

// Error handler
export const errorHandler = (error: HttpErrorType | any, req: Request, res: Response, next: NextFunction) => {
  if (instanceOfHttpError(error)) {
    const errInstance = error as HttpErrorType;

    if (errInstance.statusCode !== 500) {
      return res.status(errInstance.statusCode).json({ errors: errInstance.errorObjects });
    }
  }

  if (process.env.NODE_ENV !== "production") {
    return res.status(500).json({ errors: `${error.message}` });
  }

  // Return 500 with error message
  return res.status(500).json({ errors: "Unknown server error." });
};
