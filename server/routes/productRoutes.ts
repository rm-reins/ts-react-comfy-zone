import express from "express";
import {
  getAllProducts,
  getSingleProduct,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";
import { getSingleProductReviews } from "../controllers/reviewController.js";
import { isAdmin } from "../middleware/clerk-user.js";

const router = express.Router();

router.route("/").post(isAdmin, createProduct).get(getAllProducts);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(isAdmin, updateProduct)
  .delete(isAdmin, deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

export { router as productRouter };
