import express from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser, isAdmin } from "../middleware/clerk-user";
import {
  getAllOrders,
  createOrder,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
} from "../controllers/orderController";

const router = express.Router();

const authMiddleware = requireAuth({
  signInUrl: "/sign-in",
  debug: true,
});

router
  .route("/")
  .get(authMiddleware, syncClerkUser, isAdmin, getAllOrders)
  .post(authMiddleware, syncClerkUser, createOrder);

router
  .route("/show-all-my-orders")
  .get(authMiddleware, syncClerkUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authMiddleware, syncClerkUser, getSingleOrder)
  .patch(authMiddleware, syncClerkUser, isAdmin, updateOrder);

export { router as orderRouter };
