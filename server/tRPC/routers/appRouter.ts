import { router } from "../trpc.js";
import { productRouter } from "./product.js";
import { orderRouter } from "./order.js";
import { reviewRouter } from "./review.js";
import { addressRouter } from "./address.js";

export const appRouter = router({
  product: productRouter,
  order: orderRouter,
  review: reviewRouter,
  address: addressRouter,
});

export type AppRouter = typeof appRouter;
