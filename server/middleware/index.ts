import express, { Application } from "express";
import helmet from "helmet";
import cors from "cors";
import rateLimit from "express-rate-limit";
import ExpressMongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import { clerkMiddleware } from "@clerk/express";
import { config } from "../config/index.js";
import compression from "compression";
import morgan from "morgan";
import { randomUUID } from "crypto";
import { logger } from "../utils/logger.js";

export const setupCommonMiddleware = (app: Application) => {
  const corsOptions = {
    origin:
      config.environment === "development"
        ? [config.clientUrl, "https://hoppscotch.io", "null"] // Allow Hoppscotch in dev
        : config.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "svix-id",
      "svix-signature",
      "svix-timestamp",
      "Accept",
      "Origin",
      "Access-Control-Request-Method",
      "Access-Control-Request-Headers",
    ],
    exposedHeaders: ["Content-Range", "X-Content-Range"],
    maxAge: 86400, // 24 hours
  };

  app.use(compression());

  app.set("trust proxy", 1);
  app.use(helmet());
  app.use(cors(corsOptions));

  // Add CORS debugging
  app.use((req, res, next) => {
    if (req.path.includes("/api/trpc")) {
      logger.info({
        message: "CORS debug",
        origin: req.headers.origin,
        method: req.method,
        path: req.path,
      });
    }
    next();
  });

  app.use(ExpressMongoSanitize());

  app.use(rateLimit(config.rateLimit));
  if (config.environment === "development") {
    app.use(morgan("dev"));
  }
  app.use((req, res, next) => {
    req.id = randomUUID();
    res.setHeader("X-Request-ID", req.id);
    next();
  });

  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));

  app.use(clerkMiddleware());
};
