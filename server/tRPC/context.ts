import type { IUser } from "../models/User.js";
import { User } from "../models/User.js";
import { Admin, type IAdmin } from "../models/Admin.js";
import { CreateExpressContextOptions } from "@trpc/server/adapters/express";

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

  if (req.user) {
    const adminUser = await Admin.findOne({ clerkId: req.auth?.userId });

    if (adminUser) {
      user = adminUser;
    } else {
      const regularUser = await User.findOne({ clerkId: req.auth?.userId });
      if (regularUser) {
        user = regularUser;
      }
    }
  }
  const requestId = req.id;

  return {
    req,
    res,
    user,
    requestId,
  };
}
