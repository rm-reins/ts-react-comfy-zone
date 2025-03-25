import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import multer from "multer";
import dotenv from "dotenv";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Define extended params interface
interface CloudinaryParams {
  folder: string;
  allowed_formats: string[];
  transformation: Array<{
    width: number;
    height: number;
    crop: string;
  }>;
}

const productStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "comfy-zone/products",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [
      {
        width: 1000,
        height: 1000,
        crop: "limit",
      },
    ],
  } as CloudinaryParams,
});

const reviewStorage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "comfy-zone/reviews",
    allowed_formats: ["jpg", "png", "jpeg"],
    transformation: [{ width: 1000, height: 1000, crop: "limit" }],
  } as CloudinaryParams,
});

export const productImageUpload = multer({
  storage: productStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});

export const reviewImageUpload = multer({
  storage: reviewStorage,
  limits: { fileSize: 3 * 1024 * 1024 }, // 3 MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith("image/")) {
      cb(null, true);
    } else {
      cb(new Error("Only image files are allowed"));
    }
  },
});
