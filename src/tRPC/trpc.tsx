import { httpBatchLink } from "@trpc/client";
import { createTRPCReact } from "@trpc/react-query";
import { QueryClient } from "@tanstack/react-query";
import { useState } from "react";

const trpc = createTRPCReact<any>();

export function TrpcProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [trpcClient] = useState(() => {
    // @ts-expect-error - Runtime works but TypeScript can't verify the type
    return trpc.createClient({
      links: [
        httpBatchLink({
          url: "http://localhost:5174/api/trpc",
          fetch(url, options) {
            return fetch(url, {
              ...options,
              credentials: "include",
            });
          },
        }),
      ],
    });
  });

  return (
    // @ts-expect-error - Runtime works but TypeScript can't verify the type
    <trpc.Provider
      client={trpcClient}
      queryClient={queryClient}
    >
      {children}
    </trpc.Provider>
  );
}
// Export client for use in components
export { trpc };
