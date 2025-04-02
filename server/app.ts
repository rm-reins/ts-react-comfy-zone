import "dotenv/config";
import "express-async-errors";
import express from "express";
import { Server } from "http";
import connectDB from "./db/connect.js";
import { config } from "./config/index.js";
import { setupRoutes } from "./routes/index.js";
import { clerkMiddleware } from "@clerk/express";
import path from "path";
import { fileURLToPath } from "url";
// Middleware
import { notFoundMiddleware } from "./middleware/not-found.js";
import { logger, enhancedErrorHandler } from "./middleware/error-handler.js";
import { setupCommonMiddleware } from "./middleware/index.js";
// tRPC
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { createContext } from "./tRPC/context.js";
import { appRouter } from "./tRPC/routers/appRouter.js";

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// Setup common middleware
setupCommonMiddleware(app);

// Setup routes for REST API
setupRoutes(app);

// Setup tRPC
app.use(
  "/api/trpc",
  clerkMiddleware(),
  createExpressMiddleware({
    router: appRouter,
    createContext,
  })
);

app.use((req, res, next) => {
  res.setHeader(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'self' https://*.clerk.accounts.dev https://cdn.jsdelivr.net; connect-src 'self' https://*.clerk.accounts.dev https://api.clerk.dev; frame-src 'self' https://*.clerk.accounts.dev; img-src 'self' https://*.clerk.accounts.dev;"
  );
  next();
});

// Serve static frontend files in production
if (process.env.NODE_ENV === "production") {
  // Serve static files
  app.use(express.static(path.join(__dirname, "../../dist")));

  // Send all other requests to the client app
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../../dist/index.html"));
  });

  logger.info("Serving frontend static files");
}

// Handle 404 errors for API routes
app.use("/api/*", notFoundMiddleware);

// Handle errors
app.use(enhancedErrorHandler);

// Start the server
const PORT = config.port;

let server: Server;

const start = async () => {
  try {
    await connectDB(config.mongoUri as string);
    logger.info("Connected to MongoDB");

    server = app.listen(PORT, () => {
      logger.info(`Server is listening on port ${PORT}...`);
    });
  } catch (error) {
    logger.error({
      message: "Error starting server",
      error: error instanceof Error ? error.message : String(error),
    });
  }
};

start();

process.on("unhandledRejection", (err) => {
  logger.error({
    message: "UNHANDLED REJECTION! 💥 Shutting down...",
    error: err instanceof Error ? err.message : String(err),
  });
  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});
