import { Response, Request, NextFunction } from "express";

// Error handler
export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  // Return 500 with error message
  return res.status(500).json({ error: `${error.message}` });
};
