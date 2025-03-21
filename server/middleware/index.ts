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

export const setupCommonMiddleware = (app: Application) => {
  const corsOptions = {
    origin: config.clientUrl,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  };

  app.use(compression());

  app.set("trust proxy", 1);
  app.use(helmet()); // TODO implement CSP
  app.use(cors(corsOptions));
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

  app.use(express.json({ limit: "2mb" }));
  app.use(cookieParser());
  app.use(express.urlencoded({ extended: true, limit: "2mb" }));

  app.use(clerkMiddleware());
};
