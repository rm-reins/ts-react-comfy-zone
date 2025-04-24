import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/custom-errors.js";

const getAllOrders = async (req: Request, res: Response): Promise<void> => {
  const orders = await Order.find({});
  res.status(StatusCodes.OK).json({ orders });
};

const getSingleOrder = async (req: Request, res: Response): Promise<void> => {
  const { id: orderId } = req.params;
  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw NotFoundError(`No order with id: ${orderId}`);
  }

  if (
    req.user?.role !== "admin" &&
    order.user.toString() !== req.user?.clerkId
  ) {
    throw UnauthorizedError("You are not authorized to view this order");
  }

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orders = await Order.find({ user: req.user?.clerkId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { cartItems } = req.body;

  if (!cartItems || cartItems.length < 1) {
    throw BadRequestError("Cart has no items");
  }

  const orderItems: object[] = [];
  let subtotal = 0;
  let shippingFee = 0;

  for (const item of cartItems) {
    const dbProduct = await Product.findOne({ _id: item._id });

    if (!dbProduct) {
      throw NotFoundError(`No product with item id: ${item._id} was found.`);
    }

    const { name, price, _id } = dbProduct;

    const singleOrderItem = {
      quantity: item.quantity,
      name,
      price,
      image: item.image,
      _id,
      color: item.color,
    };

    orderItems.push(singleOrderItem);
    subtotal += price * item.quantity;
  }

  const tax = Math.ceil(subtotal * 0.21);
  shippingFee = subtotal > 200 ? 0 : 25;

  const total = subtotal + tax + shippingFee;

  const order = await Order.create({
    orderItems,
    total,
    subtotal,
    tax,
    shippingFee,
    user: req.user?.clerkId,
  });

  res.status(StatusCodes.CREATED).json({ order });
};

const updateOrder = async (req: Request, res: Response): Promise<void> => {
  const { id: orderId } = req.params;
  const { paymentMethod } = req.body;
  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw NotFoundError(`No order with id: ${orderId}`);
  }

  order.paymentMethod = paymentMethod;
  order.status = "paid";
  await order.save();

  res.status(StatusCodes.OK).json({ order });
};

export {
  getAllOrders,
  getSingleOrder,
  getCurrentUserOrders,
  createOrder,
  updateOrder,
};
