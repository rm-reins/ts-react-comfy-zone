import {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
} from "../controllers/productController.js";
import { getSingleProductReviews } from "../controllers/reviewController.js";
import express from "express";

const router = express.Router();

router.route("/").post(createProduct).get(getAllProducts);
router.route("/uploadImage").post(uploadImage);
router
  .route("/:id")
  .get(getSingleProduct)
  .patch(updateProduct)
  .delete(deleteProduct);
router.route("/:id/reviews").get(getSingleProductReviews);

export { router as productRouter };
