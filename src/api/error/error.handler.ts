import { Request, Response, NextFunction } from "express";
import { serverLogger } from "../../utils/logger";

export interface ApiError extends Error {
  message: string;
  httpStatus?: number;
}

export const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  serverLogger("webhook-error", "APIError", err);
  if (err.httpStatus) {
    return res.status(err.httpStatus).json({
      success: false,
      error: err.message,
    });
  }
  res.status(500).json({
    success: false,
    error: "Internal Server Error.",
  });
};
