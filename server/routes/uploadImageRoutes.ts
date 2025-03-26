import {
  uploadProductImage,
  uploadReviewImage,
  deleteImage,
} from "../controllers/uploadController";
import { isAdmin } from "../middleware/clerk-user";
import express from "express";

const router = express.Router();

router.route("/").post(isAdmin, uploadProductImage);

router.route("/review").post(uploadReviewImage);

router.route("/delete").delete(isAdmin, deleteImage);

export { router as uploadImageRouter };
