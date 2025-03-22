import { type CreateExpressContextOptions } from "@trpc/server/adapters/express";

export async function createContext({ req, res }: CreateExpressContextOptions) {
  const user = req.user;

  return {
    req,
    res,
    user,
    requestId: req.id,
  };
}

export type Context = Awaited<ReturnType<typeof createContext>>;
