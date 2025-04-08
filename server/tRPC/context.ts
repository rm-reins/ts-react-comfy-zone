import type { IUser } from "../models/User.js";
import { User } from "../models/User.js";
import { Admin, type IAdmin } from "../models/Admin.js";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import { logger } from "../utils/logger.js";

export interface Context {
  user?: IUser | IAdmin;
  requestId?: string;
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
}

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<Context> {
  let user: IUser | IAdmin | undefined = undefined;

  // Check if we have auth from Clerk
  if (req.auth?.userId) {
    logger.info(`Creating tRPC context with userId: ${req.auth.userId}`);

    const adminUser = await Admin.findOne({ clerkId: req.auth.userId });

    if (adminUser) {
      user = adminUser;
      logger.info("Admin user found in context");
    } else {
      const regularUser = await User.findOne({ clerkId: req.auth.userId });
      if (regularUser) {
        user = regularUser;
        logger.info("Regular user found in context");
      } else {
        logger.warn(
          `No user found in database for Clerk ID: ${req.auth.userId}`
        );
      }
    }
  } else {
    logger.warn("No auth.userId in request for tRPC context");
  }

  const requestId = req.id;

  return {
    req,
    res,
    user,
    requestId,
  };
}
