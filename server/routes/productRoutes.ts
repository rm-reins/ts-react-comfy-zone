import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../controllers/productController.js";
import { getSingleProductReviews } from "../controllers/reviewController.js";
import { requireAuth } from "@clerk/express";
import { syncClerkUser, isAdmin } from "../middleware/clerk-user";
import express from "express";

const router = express.Router();

const authMiddleware = requireAuth({
  signInUrl: "/sign-in",
  debug: true,
});

router
  .route("/")
  .post(authMiddleware, syncClerkUser, isAdmin, createProduct)
  .get(getAllProducts);

router
  .route("/uploadImage")
  .post(authMiddleware, syncClerkUser, isAdmin, uploadImage);

router
  .route("/:id")
  .get(getSingleProduct)
  .patch(authMiddleware, syncClerkUser, isAdmin, updateProduct)
  .delete(authMiddleware, syncClerkUser, isAdmin, deleteProduct);

router.route("/:id/reviews").get(getSingleProductReviews);

export { router as productRouter };
