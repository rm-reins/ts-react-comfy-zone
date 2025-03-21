import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import winston from "winston";
import { config } from "../config/index.js";
import fs from "fs";
import path from "path";

const logDir = "logs";
if (!fs.existsSync(logDir)) {
  fs.mkdirSync(logDir);
}

const logger = winston.createLogger({
  level: config.environment === "production" ? "info" : "debug",

  format: winston.format.combine(
    winston.format.timestamp({ format: "DD-MM-YYYY HH:mm:ss" }),
    winston.format.errors({ stack: true }),
    winston.format.json()
  ),

  defaultMeta: { service: "comfy-zone-api" },

  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.printf(
          ({ timestamp, level, message, ...meta }) =>
            `${timestamp} ${level}: ${message} ${
              Object.keys(meta).length && meta.service !== "comfy-zone-api"
                ? JSON.stringify(meta, null, 2)
                : ""
            }`
        )
      ),
    }),

    new winston.transports.File({
      filename: path.join(
        logDir,
        `error-${new Date().toISOString().split("T")[0]}.log`
      ),
      level: "error",
    }),
    new winston.transports.File({
      filename: path.join(
        logDir,
        `combined-${new Date().toISOString().split("T")[0]}.log`
      ),
    }),
  ],
});

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
