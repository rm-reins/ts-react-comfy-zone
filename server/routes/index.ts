import { authRouter } from "./authRoutes.js";
import { userRouter } from "./userRoutes.js";
import { productRouter } from "./productRoutes.js";
import { reviewRouter } from "./reviewRoutes.js";
import { orderRouter } from "./orderRoutes.js";
import { Application } from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middleware/clerk-user";
import { adminRouter } from "./adminRoutes.js";

const authMiddleware = requireAuth({
  signInUrl: "/sign-in",
  debug: process.env.NODE_ENV !== "production",
});

export const setupRoutes = (app: Application) => {
  //Public
  app.use("/api/v1/auth", authRouter);

  //Protected
  app.use("/api/v1/users", authMiddleware, syncClerkUser, userRouter);
  app.use("/api/v1/admins", authMiddleware, syncClerkUser, adminRouter);
  app.use("/api/v1/products", authMiddleware, syncClerkUser, productRouter);
  app.use("/api/v1/reviews", authMiddleware, syncClerkUser, reviewRouter);
  app.use("/api/v1/orders", authMiddleware, syncClerkUser, orderRouter);
};
