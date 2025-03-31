import {
  uploadProductImage,
  uploadReviewImage,
  deleteImage,
} from "../controllers/uploadController.js";
import { isAdmin } from "../middleware/clerk-user.js";
import express from "express";

const router = express.Router();

router.route("/").post(isAdmin, uploadProductImage);

router.route("/review").post(uploadReviewImage);

router.route("/delete").delete(isAdmin, deleteImage);

export { router as uploadImageRouter };
