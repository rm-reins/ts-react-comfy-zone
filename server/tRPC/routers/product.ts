import { router, publicProcedure, adminProcedure } from "../trpc.js";
import { z } from "zod";
import Product from "../../models/Product.js";
import { TRPCError } from "@trpc/server";

const productInputSchema = z.object({
  name: z.string().min(3, "Name must be at lease 3 characters long"),
  price: z.number().positive("Price must be positive"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long"),
  image: z.string().optional(),
  category: z.string(),
  company: z.string(),
  featured: z.boolean().optional().default(false),
  inventory: z.number().int().nonnegative().optional().default(0),
  averageRating: z.number().optional().default(0),
  numOfReviews: z.number().int().optional().default(0),
  createdAt: z.date().default(() => new Date()),
  updatedAt: z.date().default(() => new Date()),
});

export const productRouter = router({
  getAll: publicProcedure.query(async () => {
    try {
      const products = await Product.find({});
      return products;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch products",
        cause: error,
      });
    }
  }),

  getById: publicProcedure
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/)) // Must match a MongoDB ObjectId (24-character hex string).
    .query(async ({ input }) => {
      try {
        const product = await Product.findById(input);

        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No product with id: ${input}`,
          });
        }

        return product;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch product",
          cause: error,
        });
      }
    }),

  create: adminProcedure
    .input(productInputSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const product = await Product.create({
          ...input,
          user: ctx?.user?.clerkId,
        });

        return product;
      } catch (error) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create product",
          cause: error,
        });
      }
    }),

  update: adminProcedure
    .input(
      z.object({
        id: z.string().regex(/^[0-9a-fA-F]{24}$/),
        product: productInputSchema.partial(), // makes all fields optional
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { id, product } = input;

        const existingProduct = await Product.findById(id);

        if (!existingProduct) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No product with id: ${id}`,
          });
        }

        const updatedProduct = await Product.findByIdAndUpdate(id, product, {
          new: true,
          runValidators: true,
        });

        return updatedProduct;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update product",
          cause: error,
        });
      }
    }),

  delete: adminProcedure
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .mutation(async ({ input: id }) => {
      try {
        const product = await Product.findById(id);

        if (!product) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No product with id: ${id}`,
          });
        }

        await Product.findByIdAndDelete(id);

        return { id, deleted: true };
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to delete product",
          cause: error,
        });
      }
    }),
});
