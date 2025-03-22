import {
  router,
  publicProcedure,
  protectedProcedure,
  adminProcedure,
} from "../trpc.js";
import { z } from "zod";
import Product from "../../models/Product";
import { TRPCError } from "@trpc/server";

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
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/))
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
});
