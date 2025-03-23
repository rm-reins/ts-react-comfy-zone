import express from "express";
import {
  getAllAdmins,
  updateAdmin,
  promoteToAdmin,
  demoteToUser,
} from "../controllers/adminController.js";
import { isAdmin } from "../middleware/clerk-user.js";

const router = express.Router();

router.route("/").get(isAdmin, getAllAdmins);
router.route("/update").patch(isAdmin, updateAdmin);
router.route("/promote").post(isAdmin, promoteToAdmin);
router.route("/demote").post(isAdmin, demoteToUser);

export const adminRouter = router;
