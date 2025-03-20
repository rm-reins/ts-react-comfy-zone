import express from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middleware/clerk-user";
import {
  getAllOrders,
  createOrder,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
} from "../controllers/orderController";

const router = express.Router();

// Configure requireAuth with signIn options
const authMiddleware = requireAuth({
  signInUrl: "/sign-in",
  debug: true,
});

router
  .route("/")
  .get(authMiddleware, syncClerkUser, getAllOrders)
  .post(authMiddleware, syncClerkUser, createOrder);

router
  .route("/show-all-my-orders")
  .get(authMiddleware, syncClerkUser, getCurrentUserOrders);

router
  .route("/:id")
  .get(authMiddleware, syncClerkUser, getSingleOrder)
  .patch(authMiddleware, syncClerkUser, updateOrder);

export { router as orderRouter };
