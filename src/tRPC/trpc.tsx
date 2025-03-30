import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";

export type AppRouter =
  import("../../server/tRPC/routers/appRouter.js").AppRouter;

export const trpc = createTRPCReact<AppRouter>();

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() =>
    trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:5174/api/trpc", // TODO change for production
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    })
  );

  return (
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      {children}
    </trpc.Provider>
  );
}
