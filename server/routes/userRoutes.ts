import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
} from "../controllers/userController.js";
import express from "express";
import { requireAuth } from "@clerk/express";
import { syncClerkUser, isAdmin } from "../middleware/clerk-user";

const router = express.Router();

const authMiddleware = requireAuth({
  signInUrl: "/sign-in",
  debug: true,
});

router.route("/").get(authMiddleware, syncClerkUser, isAdmin, getAllUsers);
router.route("/showMe").get(authMiddleware, syncClerkUser, showCurrentUser);
router.route("/updateUser").patch(authMiddleware, syncClerkUser, updateUser);
router.route("/:id").get(authMiddleware, syncClerkUser, getSingleUser);

export { router as userRouter };
