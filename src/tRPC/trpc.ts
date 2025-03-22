import { createTRPCClient, httpBatchLink } from "@trpc/client";
import type { AppRouter } from "../../server/tRPC/routers/appRouter";

export const trpc = createTRPCClient<AppRouter>({
  links: [
    httpBatchLink({
      url: "/api/trpc",
      fetch: (url, options) => {
        return fetch(url, {
          ...options,
          credentials: "include",
        });
      },
    }),
  ],
});
