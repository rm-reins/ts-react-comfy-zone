import express from "express";
import { isAdmin } from "../middleware/clerk-user";
import {
  getAllOrders,
  createOrder,
  getCurrentUserOrders,
  getSingleOrder,
  updateOrder,
} from "../controllers/orderController";

const router = express.Router();

router.route("/").get(isAdmin, getAllOrders).post(createOrder);

router.route("/show-all-my-orders").get(getCurrentUserOrders);

router.route("/:id").get(getSingleOrder).patch(isAdmin, updateOrder);

export { router as orderRouter };
