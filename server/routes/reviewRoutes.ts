import {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
} from "../controllers/reviewController.js";
import express from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middleware/clerk-user";

const router = express.Router();

const authMiddleware = requireAuth({
  signInUrl: "/sign-in",
  debug: true,
});

router
  .route("/")
  .get(getAllReviews)
  .post([authMiddleware, syncClerkUser], createReview);

router
  .route("/:id")
  .get(getSingleReview)
  .patch([authMiddleware, syncClerkUser], updateReview)
  .delete([authMiddleware, syncClerkUser], deleteReview);

export { router as reviewRouter };
