import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import { config } from "../config/index.js";
import { logger } from "../utils/logger.js";
import "../types/clerk";

const errorHandlerMiddleware = (
  err: Error & {
    statusCode?: number;
    code?: number;
    errors?: Record<string, { message: string }>;
    keyPattern?: Record<string, unknown>;
    value?: string;
  },
  req: Request,
  res: Response
) => {
  const customError = {
    statusCode: err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR,
    msg: err.message || "Something went wrong try again later",
  };

  if (err.name === "ValidationError") {
    customError.msg = Object.values(err.errors || {})
      .map((item) => item.message)
      .join(",");
    customError.statusCode = 400;
  }

  if (err.code && err.code === 11000) {
    customError.msg = `Duplicate value entered for ${Object.keys(
      err.keyPattern || {}
    )} field, please choose another value`;
    customError.statusCode = 400;
  }

  if (err.name === "CastError") {
    customError.msg = `No item found with id: ${err.value}`;
    customError.statusCode = 404;
  }

  return res.status(customError.statusCode).json({ msg: customError.msg });
};

const enhancedErrorHandler = (err, req: Request, res: Response) => {
  logger.error({
    message: err.message,
    stack: err.stack,
    method: req.method,
    path: req.path,
    ip: req.ip,
    userId: req.auth?.userId || "not authenticated",
    body: config.environment === "development" ? req.body : undefined,
    query: req.query,
  });

  // Call the original error handler
  errorHandlerMiddleware(err, req, res);
};

export { logger, enhancedErrorHandler };
