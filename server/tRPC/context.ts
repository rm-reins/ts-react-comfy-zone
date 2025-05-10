import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { logger } from "../utils/logger.js";
import { getAuth } from "@clerk/express";

export interface Context {
  userId?: string;
  auth?: {
    userId: string;
    sessionId?: string;
    orgId?: string;
    orgRole?: string;
    [key: string]: unknown;
  };
  requestId?: string;
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
}

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<Context> {
  try {
    const clerkAuth = getAuth(req);
    const userId = clerkAuth?.userId;

    if (userId) {
      logger.info({
        message: "tRPC context created with authenticated user",
        userId,
        sessionId: clerkAuth?.sessionId || undefined,
      });
    } else {
      logger.warn({
        message: "Unauthenticated request to tRPC endpoint.",
        path: req.path,
        hasAuthHeader: !!req.headers.authorization,
      });
    }

    const auth = userId
      ? {
          userId,
          sessionId: clerkAuth?.sessionId || "",
          orgId: clerkAuth?.orgId,
          orgRole: clerkAuth?.orgRole,
        }
      : undefined;

    return {
      req,
      res,
      userId: userId || undefined,
      auth,
      requestId: req.id,
    };
  } catch (error) {
    logger.error({
      message: "Error in tRPC context creation",
      error: error instanceof Error ? error.message : String(error),
      stack: error instanceof Error ? error.stack : undefined,
    });

    return { req, res, requestId: req.id };
  }
}
