import express from "express";
import { register, login, logout } from "../controllers/authController";
import { requireAuth } from "@clerk/express";
import { syncClerkUser } from "../middleware/clerk-user";

const router = express.Router();

// Configure requireAuth with signIn options
const authMiddleware = requireAuth({
  signInUrl: "/sign-in",
  debug: true,
});

router.post("/register", authMiddleware, syncClerkUser, register);
router.post("/login", authMiddleware, syncClerkUser, login);
router.post("/logout", authMiddleware, syncClerkUser, logout);

export { router as authRouter };
