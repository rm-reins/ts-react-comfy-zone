import Review from "../models/Review.js";
import Product from "../models/Product.js";
import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/custom-errors.js";

const createReview = async (req: Request, res: Response): Promise<void> => {
  const { product: productId } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw NotFoundError(`No product with id: ${productId}`);
  }

  const hasReview = await Review.findOne({
    product: productId,
    user: req.user?.clerkId,
  });

  if (hasReview) {
    throw BadRequestError("Review has been already submitted for this product");
  }

  req.body.user = req.user?.clerkId;
  const review = await Review.create(req.body);

  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  const reviews = await Review.find({}).populate({
    path: "product",
    select: "name company price",
  });

  res.status(StatusCodes.OK).json({ reviews });
};

const getSingleReview = async (req: Request, res: Response): Promise<void> => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw NotFoundError(`No review with id: ${reviewId}`);
  }

  res.status(StatusCodes.OK).json({ review });
};

const updateReview = async (req: Request, res: Response): Promise<void> => {
  const { id: reviewId } = req.params;
  const { rating, title, comment } = req.body;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw NotFoundError("No review with id: ${reviewId}");
  }

  if (review.user.toString() !== req.user?.clerkId) {
    throw UnauthorizedError("You are not authorized to view this order");
  }

  review.rating = rating;
  review.title = title;
  review.comment = comment;

  await review.save();
  res.status(StatusCodes.OK).json({ review });
};

const deleteReview = async (req: Request, res: Response): Promise<void> => {
  const { id: reviewId } = req.params;
  const review = await Review.findOne({ _id: reviewId });

  if (!review) {
    throw NotFoundError(`No review with id: ${reviewId}`);
  }

  await review.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Review deleted" });
};

const getSingleProductReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: productId } = req.params;
  const reviews = await Review.find({ product: productId });

  if (!reviews) {
    throw NotFoundError(`No reviews found for product with id: ${productId}`);
  }

  res.status(StatusCodes.OK).json({ reviews, count: reviews.length });
};

export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
