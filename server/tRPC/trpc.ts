import { initTRPC, TRPCError } from "@trpc/server";
import { ZodError } from "zod";
import { Context } from "./context.js";
import { logger } from "../utils/logger.js";

const trpcServer = initTRPC.context<Context>().create({
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

export const protectedProcedure = trpcServer.procedure.use(({ ctx, next }) => {
  if (!ctx.userId) {
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

export const adminProcedure = trpcServer.procedure.use(({ ctx, next }) => {
  if (!ctx.userId || !ctx.auth) {
    throw new TRPCError({
      code: "UNAUTHORIZED",
      message: "Authentication required",
    });
  }

  if (!("orgRole" in ctx.auth) || ctx.auth?.orgRole !== "admin") {
    throw new TRPCError({
      code: "FORBIDDEN",
      message: "Access denied. Admin privileges required",
    });
  }

  return next({
    ctx,
  });
});

export const router = trpcServer.router;
export const publicProcedure = trpcServer.procedure;

export { TRPCError };
