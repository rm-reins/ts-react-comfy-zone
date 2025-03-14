import "dotenv/config";
import "express-async-errors";
import express from "express";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import cors from "cors";
import rateLimit from "express-rate-limit";
import ExpressMongoSanitize from "express-mongo-sanitize";
import { connectDB } from "./db/connect.js";
import { notFoundMid } from "./middleware/not-found.js";
import errorHandlerMid from "./middleware/error-handler.js";
import { authRouter } from "./routes/authRoutes.js";
import { userRouter } from "./routes/userRoutes.js";
import { prodRouter } from "./routes/productRoutes.js";
import fileUpload from "express-fileupload";
import { reviewRouter } from "./routes/reviewRoutes.js";
import { orderRouter } from "./routes/orderRoutes.js";
import { clerkMiddleware, requireAuth } from "@clerk/express";
import { syncClerkUser } from "./middleware/clerk-user";

const app = express();

app.set("trust proxy", 1);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 60,
  })
);

app.use(cookieParser(process.env.JWT_SECRET));
app.use(cors());

app.use(express.json());
app.use(express.static("public"));
app.use("uploads", express.static("uploads"));
app.use(fileUpload());
app.use(helmet());
app.use(ExpressMongoSanitize());

// Add Clerk middleware to all routes
app.use(clerkMiddleware());

// Public routes
app.use("/api/v1/auth", authRouter);

// Protected routes with Clerk authentication
app.use("/api/v1/users", requireAuth(), syncClerkUser, userRouter);
app.use("/api/v1/products", requireAuth(), syncClerkUser, prodRouter);
app.use("/api/v1/reviews", requireAuth(), syncClerkUser, reviewRouter);
app.use("/api/v1/orders", requireAuth(), syncClerkUser, orderRouter);

app.use(notFoundMid);
app.use(errorHandlerMid);

const port = process.env.PORT || 5174;

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI);
    app.listen(port, () => console.log(`Server is listening on port ${port}`));
  } catch (error) {
    console.log(error);
  }
};

start();
