import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import cloudinary from "../utils/cloudinary.js";

export const uploadProductImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: "No file uploaded" });
      return;
    }

    res.status(StatusCodes.OK).json({
      image: {
        src: req.file.path,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    console.error("Error uploading product image", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error uploading image" });
  }
};

export const uploadReviewImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    if (!req.file) {
      res.status(StatusCodes.BAD_REQUEST).json({ msg: "No file uploaded" });
      return;
    }

    res.status(StatusCodes.OK).json({
      image: {
        src: req.file.path,
        filename: req.file.filename,
      },
    });
  } catch (error) {
    console.error("Error uploading review image", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error uploading image" });
  }
};

export const deleteImage = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { public_id } = req.body;
    if (!public_id) {
      res.status(StatusCodes.BAD_REQUEST).json({
        msg: "No image id provided",
      });
      return;
    }

    await cloudinary.uploader.destroy(public_id);
    res.status(StatusCodes.OK).json({ msg: "Image deleted successfully" });
  } catch (error) {
    console.error("Error deleting image", error);
    res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Error deleting image" });
  }
};
