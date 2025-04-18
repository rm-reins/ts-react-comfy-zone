import { router, publicProcedure, adminProcedure } from "../trpc.js";
import { z } from "zod";
import Product from "../../models/Product.js";
import { TRPCError } from "@trpc/server";

const productInputSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(100, "Name cannot be more than 100 characters"),
  price: z.number().positive("Price must be positive"),
  description: z
    .string()
    .min(10, "Description must be at least 10 characters long")
    .max(1000, "Description cannot be more than 1000 characters"),
  images: z.array(z.string()).optional(),
  category: z.enum([
    "office",
    "kitchen",
    "bedroom",
    "home decor",
    "storage",
    "textiles",
    "other",
  ]),
  company: z.string(),
  colors: z.array(z.string()),
  featured: z.boolean().optional().default(false),
  inventory: z.number().int().nonnegative().optional().default(0),
  averageRating: z.number().optional().default(0),
  numOfReviews: z.number().int().optional().default(0),
  user: z.string().optional(),
  createdAt: z
    .date()
    .optional()
    .default(() => new Date()),
  updatedAt: z
    .date()
    .optional()
    .default(() => new Date()),
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
        if (!ctx?.user?.clerkId) {
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "User must be authenticated to create a product",
          });
        }

        // Create product with user from context
        const productData = { ...input };
        // Remove user field if it exists, as we'll set it from context
        delete productData.user;

        const product = await Product.create({
          ...productData,
          user: ctx.user.clerkId,
        });

        return product;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

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

        const existingProduct = await Product.findOne({ _id: id });

        if (!existingProduct) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No product with id: ${id}`,
          });
        }

        // Create a copy of the product data and remove the user field if it exists
        const productData = { ...product };
        delete productData.user; // Prevent updating the user field

        const updatedProduct = await Product.findOneAndUpdate(
          { _id: id },
          productData,
          {
            new: true,
            runValidators: true,
          }
        );

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
