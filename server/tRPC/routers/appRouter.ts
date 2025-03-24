import { router } from "../trpc.js";
import { productRouter } from "./product.js";
import { orderRouter } from "./order.js";
import { userRouter } from "./user.js";
import { reviewRouter } from "./review.js";

export const appRouter = router({
  product: productRouter,
  order: orderRouter,
  user: userRouter,
  review: reviewRouter,
});

export type AppRouter = typeof appRouter;
