import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../trpc.js";
import { z } from "zod";
import Review from "../../models/Review.js";
import Product from "../../models/Product.js";
import { TRPCError } from "@trpc/server";

export const reviewRouter = router({
  getAllReviews: publicProcedure.query(async () => {
    try {
      const reviews = await Review.find({})
        .populate({
          path: "product",
          select: "name company price",
        })
        .populate({
          path: "user",
          select: "name",
        });

      return reviews;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch reviews",
        cause: error,
      });
    }
  }),

  getSingleProductReviews: publicProcedure
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .query(async ({ input: productId }) => {
      try {
        const reviews = await Review.find({ product: productId });
        return reviews;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch product reviews",
          cause: error,
        });
      }
    }),

  createReview: protectedProcedure
    .input(
      z.object({
        product: z.string().regex(/^[0-9a-fA-F]{24}$/),
        rating: z.number().min(1).max(5),
        title: z.string().min(2).max(100),
        comment: z.string().max(300),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { product: productId, rating, title, comment } = input;

        const product = await Product.findById(productId);
        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No product with id: ${productId}`,
          });
        }

        const existingReview = await Review.findOne({
          product: productId,
          user: ctx.user?.clerkId,
        });

        if (existingReview) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "You already have reviewed this product",
          });
        }

        const review = await Review.create({
          user: ctx.user?.clerkId,
          product: productId,
          rating,
          title,
          comment,
        });

        const allProductReviews = await Review.find({ product: productId });
        const totalRating = allProductReviews.reduce(
          (sum: number, review) => sum + review.rating,
          0
        );
        const averageRating =
          allProductReviews.length > 0
            ? totalRating / allProductReviews.length
            : 0;

        await Product.findByIdAndUpdate(
          productId,
          {
            averageRating,
            numOfReviews: allProductReviews.length,
          },
          { new: true, runValidators: true }
        );

        return review;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create review",
          cause: error,
        });
      }
    }),

  updateReview: protectedProcedure
    .input(
      z.object({
        reviewId: z.string().regex(/^[0-9a-fA-F]{24}$/),
        rating: z.number().min(1).max(5),
        title: z.string().min(2).max(100),
        comment: z.string().max(300),
      })
    )
    .mutation(async ({ ctx, input }) => {
      try {
        const { reviewId, ...updates } = input;

        const review = await Review.findById(reviewId);
        if (!review) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No review with id: ${reviewId}`,
          });
        }

        if (review.user.toString() !== ctx.user?.clerkId) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized to update this review",
          });
        }

        const updatedReview = await Review.findByIdAndUpdate(
          reviewId,
          updates,
          {
            new: true,
            runValidators: true,
          }
        );

        if (updates.rating) {
          const productId = review.product;
          const allProductReviews = await Review.find({ product: productId });
          const totalRating = allProductReviews.reduce(
            (sum: number, review) => sum + review.rating,
            0
          );

          const averageRating =
            allProductReviews.length > 0
              ? totalRating / allProductReviews.length
              : 0;

          await Product.findByIdAndUpdate(
            productId,
            {
              averageRating,
            },
            { new: true, runValidators: true }
          );
        }

        return updatedReview;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update review",
          cause: error,
        });
      }
    }),

  deleteReview: adminProcedure
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .mutation(async ({ input: reviewId }) => {
      try {
        const review = await Review.findById(reviewId);
        if (!review) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No review with id: ${reviewId}`,
          });
        }

        await Review.findByIdAndDelete(reviewId);

        const productId = review.product;
        const allProductReviews = await Review.find({ product: productId });

        const totalRating = allProductReviews.reduce(
          (sum: number, review) => sum + review.rating,
          0
        );
        const averageRating =
          allProductReviews.length > 0
            ? totalRating / allProductReviews.length
            : 0;

        await Product.findByIdAndUpdate(
          productId,
          {
            averageRating,
          },
          { new: true, runValidators: true }
        );
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete review",
          cause: error,
        });
      }
    }),
});
