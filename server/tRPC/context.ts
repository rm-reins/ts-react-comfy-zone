import type { CreateExpressContextOptions } from "@trpc/server/adapters/express";
import type { IUser } from "../models/User.js";
import "../types/express-auth";

export interface Context {
  user?: IUser;
  requestId?: string;
  req: CreateExpressContextOptions["req"];
  res: CreateExpressContextOptions["res"];
}

export async function createContext({
  req,
  res,
}: CreateExpressContextOptions): Promise<Context> {
  const user = req.user as IUser | undefined;

  const requestId = req.id;

  return {
    req,
    res,
    user,
    requestId,
  };
}
