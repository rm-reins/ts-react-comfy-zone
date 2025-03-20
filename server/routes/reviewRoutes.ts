import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import express from "express";

const router = express.Router();

router.route("/").get(getAllReviews).post(createReview);

router
  .route("/:id")
  .get(getSingleReview)
  .patch(updateReview)
  .delete(deleteReview);

export { router as reviewRouter };
