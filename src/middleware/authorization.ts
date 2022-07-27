import jwt, { Secret } from "jsonwebtoken";

import { secretKey } from "../utils/config";
import { httpError } from "../utils/httpError";

export const validateToken = async (req: any, res: any, next: any) => {
  const authorization = req.get("authorization");
  if (!authorization || !authorization.toLowerCase().startsWith("bearer ")) {
    return next(httpError([], `authorization_error`, 400));
  }
  const token = authorization.substring(7) as string;
  const key = secretKey as Secret;
  try {
    jwt.verify(token, key);
    next();
  } catch (err) {
    return next(httpError([err], `authorization_error`, 400));
  }
};
