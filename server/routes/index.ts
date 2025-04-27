import { authRouter } from "./authRoutes.js";
import { userRouter } from "./userRoutes.js";
import { productRouter } from "./productRoutes.js";
import { reviewRouter } from "./reviewRoutes.js";
import { orderRouter } from "./orderRoutes.js";
import { Application } from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middleware/clerk-user.js";
import { adminRouter } from "./adminRoutes.js";
import { uploadImageRouter } from "./uploadImageRoutes.js";
import { webhookRouter } from "./webhookRoutes.js";
import { translationRouter } from "./translationRoutes.js";

const authMiddleware = requireAuth({
  signInUrl: "/sign-in",
  debug: process.env.NODE_ENV !== "production",
});

export const setupRoutes = (app: Application) => {
  // Health check endpoint for Render
  app.get("/api/healthcheck", (req, res) => {
    res.status(200).json({ status: "ok", environment: process.env.NODE_ENV });
  });

  // Public
  app.use("/api/v1/auth", authRouter);
  app.use("/api/v1/translations", translationRouter);

  // Webhooks (public, but secured by signature verification)
  app.use("/api/v1/webhooks/clerk", webhookRouter);

  // Protected
  app.use("/api/v1/users", authMiddleware, syncClerkUser, userRouter);
  app.use("/api/v1/admins", authMiddleware, syncClerkUser, adminRouter);
  app.use("/api/v1/products", authMiddleware, syncClerkUser, productRouter);
  app.use("/api/v1/reviews", authMiddleware, syncClerkUser, reviewRouter);
  app.use("/api/v1/orders", authMiddleware, syncClerkUser, orderRouter);
  app.use("/api/v1/upload", authMiddleware, syncClerkUser, uploadImageRouter);
};
