import { Router } from "express";

import httpError from "../utils/httpError";
import { getSymphoniesByCompositorId } from "../managers/symphony";

const controller = Router();

// Describe
// Get symphonies by compositor id
controller.get("/compositor/:compositorid", async (req, res, next) => {
  try {
    const compositorId = req.params.compositorid;

    const response = await getSymphoniesByCompositorId(compositorId);
    return res.send(response);
  } catch (err) {
    console.error("err", err);
    return next(httpError(err, 404));
  }
});

export default controller;
