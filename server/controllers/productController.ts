import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import Product from "../models/Product.js";
import { NotFoundError } from "../errors/custom-errors.js";
import path from "path";
import url from "url";
import "../types/clerk";

//__dirname and __filename are not used in ESM, this is a workaround
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const createProduct = async (req: Request, res: Response) => {
  req.body.user = req.user?.clerkId;
  const product = await Product.create(req.body);
  res.status(StatusCodes.CREATED).json({ product });
};

const getAllProducts = async (req: Request, res: Response) => {
  const products = await Product.find({});
  res.status(StatusCodes.OK).json({ products });
};

const getSingleProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId }).populate("reviews");

  if (!product) {
    throw NotFoundError(`No product with id: ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const updateProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const product = await Product.findOneAndUpdate({ _id: productId }, req.body, {
    new: true,
    runValidators: true,
  });

  if (!product) {
    throw NotFoundError(`No product with id: ${productId}`);
  }

  res.status(StatusCodes.OK).json({ product });
};

const deleteProduct = async (req: Request, res: Response) => {
  const { id: productId } = req.params;
  const product = await Product.findOne({ _id: productId });

  if (!product) {
    throw NotFoundError(`No product with id: ${productId}`);
  }

  await product.deleteOne();
  res.status(StatusCodes.OK).json({ msg: "Product removed" });
};

// TODO implement image upload

const uploadImage = async (req: Request, res: Response) => {};

export {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
  uploadImage,
};
