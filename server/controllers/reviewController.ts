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
  const { product: productId, rating, title, comment } = req.body;
  const isValidProduct = await Product.findOne({ _id: productId });

  if (!isValidProduct) {
    throw NotFoundError(`No product with id: ${productId}`);
  }

  const hasReview = await Review.findOne({
    product: productId,
    clerkId: req.user?.id,
  });

  if (hasReview) {
    throw BadRequestError("Review has been already submitted for this product");
  }

  const review = await Review.create({
    clerkId: req.user?.id,
    product: productId,
    rating,
    title,
    comment,
    userName: req.user?.firstName || "Unknown",
    userSurname: req.user?.lastName || "User",
  });

  const allProductReviews = await Review.find({ product: productId });
  const totalRating = allProductReviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageRating =
    allProductReviews.length > 0 ? totalRating / allProductReviews.length : 0;

  await Product.findByIdAndUpdate(
    productId,
    {
      averageRating,
      numOfReviews: allProductReviews.length,
    },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.CREATED).json({ review });
};

const getAllReviews = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);
  const totalReviews = await Review.countDocuments();

  const reviews = await Review.find({})
    .populate({
      path: "product",
      select: "name company price",
    })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  const totalPages = Math.ceil(totalReviews / Number(limit));
  const hasNextPage = Number(page) < totalPages;
  const hasPrevPage = Number(page) > 1;

  res.status(StatusCodes.OK).json({
    docs: reviews,
    totalDocs: totalReviews,
    totalPages,
    currentPage: Number(page),
    hasNextPage,
    hasPrevPage,
  });
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

  const review = await Review.findById(reviewId);

  if (!review) {
    throw NotFoundError("No review with id: ${reviewId}");
  }

  if (review.clerkId !== req.user?.id) {
    throw UnauthorizedError("You are not authorized to update this review");
  }

  const updatedReview = await Review.findByIdAndUpdate(
    reviewId,
    { rating, title, comment },
    { new: true, runValidators: true }
  );

  if (rating && rating !== review.rating) {
    const productId = review.product;
    const allProductReviews = await Review.find({ product: productId });
    const totalRating = allProductReviews.reduce(
      (sum, review) => sum + review.rating,
      0
    );
    const averageRating =
      allProductReviews.length > 0 ? totalRating / allProductReviews.length : 0;

    await Product.findByIdAndUpdate(
      productId,
      { averageRating },
      { new: true, runValidators: true }
    );
  }

  res.status(StatusCodes.OK).json({ updatedReview });
};

const deleteReview = async (req: Request, res: Response): Promise<void> => {
  const { id: reviewId } = req.params;

  const review = await Review.findById(reviewId);
  if (!review) {
    throw NotFoundError(`No review with id: ${reviewId}`);
  }

  await Review.findByIdAndDelete(reviewId);

  // Update product rating
  const productId = review.product;
  const allProductReviews = await Review.find({ product: productId });
  const totalRating = allProductReviews.reduce(
    (sum, review) => sum + review.rating,
    0
  );
  const averageRating =
    allProductReviews.length > 0 ? totalRating / allProductReviews.length : 0;

  await Product.findByIdAndUpdate(
    productId,
    { averageRating },
    { new: true, runValidators: true }
  );

  res.status(StatusCodes.OK).json({ msg: "Review deleted" });
};

const getSingleProductReviews = async (
  req: Request,
  res: Response
): Promise<void> => {
  const { id: productId } = req.params;
  const { page = 1, limit = 10 } = req.query;
  const skip = (Number(page) - 1) * Number(limit);

  const product = await Product.findById(productId);
  if (!product) {
    throw NotFoundError(`No product with id: ${productId}`);
  }

  const total = await Review.countDocuments({ product: productId });

  const reviews = await Review.find({ product: productId })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(Number(limit));

  if (!reviews) {
    throw NotFoundError(`No reviews found for product with id: ${productId}`);
  }

  const totalPages = Math.ceil(total / Number(limit));
  const hasNextPage = Number(page) < totalPages;
  const hasPrevPage = Number(page) > 1;

  res.status(StatusCodes.OK).json({
    docs: reviews,
    totalDocs: total,
    totalPages,
    currentPage: Number(page),
    hasNextPage,
    hasPrevPage,
  });
};

export {
  createReview,
  getAllReviews,
  getSingleReview,
  updateReview,
  deleteReview,
  getSingleProductReviews,
};
