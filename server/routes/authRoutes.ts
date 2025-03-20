import express from "express";
import { register } from "../controllers/authController";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middleware/clerk-user";

const router = express.Router();

const authMiddleware = requireAuth({
  signInUrl: "/sign-in",
  debug: true,
});

router.route("/register").post(authMiddleware, syncClerkUser, register);

export { router as authRouter };
