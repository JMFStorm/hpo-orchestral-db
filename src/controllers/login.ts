import { Router } from "express";
import jwt, { Secret } from "jsonwebtoken";

import { adminKey, secretKey, socketServerPort } from "../utils/config";
import { httpError } from "../utils/httpError";

const controller = Router();

controller.post("/", async (req, res, next) => {
  const { password } = req.body;
  if (password !== adminKey) {
    return next(httpError([], "login_error", 400));
  }

  const tokenObject = {
    user: "HPO_System_Administrator",
  };
  const key = secretKey as Secret;
  const token = jwt.sign(tokenObject, key, { expiresIn: "1h" });
  return res.status(200).send({ token: token, socketPort: socketServerPort });
});

export default controller;
