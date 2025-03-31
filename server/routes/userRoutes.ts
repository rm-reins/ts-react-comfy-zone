import express from "express";
import {
  getAllUsers,
  getSingleUser,
  showCurrentUser,
  updateUser,
} from "../controllers/userController.js";
import { isAdmin } from "../middleware/clerk-user.js";

const router = express.Router();

router.route("/").get(isAdmin, getAllUsers);
router.route("/showMe").get(showCurrentUser);
router.route("/updateUser").patch(updateUser);
router.route("/:id").get(getSingleUser);

export { router as userRouter };
