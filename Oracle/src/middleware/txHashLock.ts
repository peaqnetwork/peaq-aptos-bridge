import { NextFunction, Request, Response } from "express";
import { rateLimiter } from "../config";

export default async function (
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    // consume one rate limit point to prevent the same transaction from processing multiple times
    await rateLimiter.consume(req.body.txHash, 1);
    return next();
  } catch (error) {
    console.error("error in txHashLock middleware", error);
    return res.status(400).json({
      success: false,
      message: "Cannot process a transaction which is already in process",
    });
  }
}
