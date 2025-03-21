import "dotenv/config";
import "express-async-errors";
import express from "express";
import connectDB from "./db/connect.js";
import { notFoundMiddleware } from "./middleware/not-found.js";
import { logger, enhancedErrorHandler } from "./middleware/error-handler.js";
import { config } from "./config/index.js";
import { setupCommonMiddleware } from "./middleware/index.js";
import { setupRoutes } from "./routes/index.js";

const app = express();

setupCommonMiddleware(app);
setupRoutes(app);

app.use(notFoundMiddleware);
app.use(enhancedErrorHandler);

const gracefulShutdown = (server) => {
  process.on("SIGTERM", () => {
    logger.info("SIGTERM received, shutting down gracefully");
    server.close(() => {
      logger.info("Process terminated");
      process.exit(0);
    });
  });

  process.on("SIGINT", () => {
    logger.info("SIGINT received, shutting down gracefully");
    server.close(() => {
      logger.info("Process terminated");
      process.exit(0);
    });
  });
};

const start = async () => {
  try {
    await connectDB(config.mongoUri as string);
    const server = app.listen(config.port, () =>
      logger.info(
        `Server is running in ${config.environment} mode on port ${config.port}`
      )
    );

    gracefulShutdown(server);
  } catch (error) {
    logger.error("Failed to start server:", error);
    process.exit(1);
  }
};

start();
