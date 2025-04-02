import express from "express";
import { handleWebhook } from "../controllers/webhookController.js";

const router = express.Router();

// Webhook endpoint for Clerk events
router.post("/", express.raw({ type: "application/json" }), (req, res) => {
  // For raw body, we need to make the raw body available as parsed JSON
  // req.body is a Buffer at this point, need to convert to string then parse
  const payload = req.body.toString("utf8");
  req.body = JSON.parse(payload);

  // Call the webhook handler and let it handle the response
  handleWebhook(req, res);
});

export { router as webhookRouter };
