import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { Context } from "./context.js";
import { logger } from "../utils/logger.js";

const t = initTRPC.context<Context>().create({
  errorFormatter: (opts) => {
    const { error, type, path, input } = opts;

    logger.error({
      message: "tRPC error",
      error: error.message,
      type,
      path,
      input: process.env.NODE_ENV !== "production" ? input : undefined,
      stack: error.stack,
    });

    if (error.cause instanceof ZodError) {
      return {
        message: error.message,
        code: error.code,
        data: {
          zodError: error.cause.flatten(),
          path,
        },
      };
    }

    return {
      message: error.message,
      code: error.code,
      data: {
        path,
      },
    };
  },
});

export const protectedProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message:
        "Authentication required - user not found in context." +
        "Make sure Clerk middleware is properly configured",
    });
  }

  return next({
    ctx,
  });
});

export const adminProcedure = t.procedure.use(({ ctx, next }) => {
  if (!ctx.user) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  if (!("role" in ctx.user) || ctx.user.role !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Access denied. Admin privileges required",
    });
  }

  return next({
    ctx,
  });
});

export const router = t.router;
export const publicProcedure = t.procedure;

export { TRPCError };
