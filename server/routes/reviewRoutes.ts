import express from "express";
import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import { isAdmin } from "../middleware/clerk-user.js";

const router = express.Router();

router.route("/").get(getAllReviews).post(createReview);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(updateReview)
  .delete(isAdmin, deleteReview);

export { router as reviewRouter };
