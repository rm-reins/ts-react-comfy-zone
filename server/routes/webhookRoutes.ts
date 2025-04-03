import express, { Request, Response } from "express";
import { handleWebhook } from "../controllers/webhookController.js";
import { logger } from "../utils/logger.js";

const router = express.Router();

// Webhook endpoint for Clerk events
router.post(
  "/",
  express.raw({ type: "application/json" }),
  async (req: Request, res: Response): Promise<void> => {
    try {
      // Log raw request for debugging
      logger.info({
        message: "Received raw webhook request",
        headers: req.headers,
        bodyLength: req.body ? req.body.length : 0,
      });

      // Convert buffer to string and parse JSON
      if (!req.body || req.body.length === 0) {
        logger.error("Webhook received empty body");
        res.status(400).json({ error: "Empty request body" });
      }

      const payload = req.body.toString("utf8");

      try {
        req.body = JSON.parse(payload);
      } catch (parseError) {
        logger.error({
          message: "Failed to parse webhook payload JSON",
          error:
            parseError instanceof Error
              ? parseError.message
              : String(parseError),
          payload:
            payload.substring(0, 200) + (payload.length > 200 ? "..." : ""), // Log truncated payload
        });
        res.status(400).json({ error: "Invalid JSON payload" });
      }

      // Handle the webhook
      await handleWebhook(req, res);
    } catch (error) {
      logger.error({
        message: "Uncaught error in webhook route handler",
        error: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
      });

      // Only send response if it hasn't been sent already
      if (!res.headersSent) {
        res
          .status(500)
          .json({ error: "Internal server error processing webhook" });
      }
    }
  }
);

export { router as webhookRouter };
