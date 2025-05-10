import Order from "../models/Order.js";
import Product from "../models/Product.js";
import { StatusCodes } from "http-status-codes";
import { Request, Response } from "express";
import {
  NotFoundError,
  BadRequestError,
  UnauthorizedError,
} from "../errors/custom-errors.js";

const roundToTwoDecimals = (value: number): number => {
  return Math.round(value * 100) / 100;
};

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

  if (req.user?.role !== "admin" && order.clerkId !== req.user?.clerkId) {
    throw UnauthorizedError("You are not authorized to view this order");
  }

  res.status(StatusCodes.OK).json({ order });
};

const getCurrentUserOrders = async (
  req: Request,
  res: Response
): Promise<void> => {
  const orders = await Order.find({ clerkId: req.user?.clerkId });
  res.status(StatusCodes.OK).json({ orders, count: orders.length });
};

const createOrder = async (req: Request, res: Response): Promise<void> => {
  const {
    orderItems,
    tax,
    shippingFee,
    subtotal,
    total,
    deliveryAddress,
    contactInformation,
    paymentMethod,
    additionalInformation,
  } = req.body;

  if (!orderItems || orderItems.length < 1) {
    throw BadRequestError("Order has no items");
  }

  if (!deliveryAddress || !contactInformation || !paymentMethod) {
    throw BadRequestError(
      "Please provide delivery address, contact information, and payment method"
    );
  }

  const processedOrderItems: object[] = [];
  let serverSubtotal = 0;

  for (const item of orderItems) {
    const dbProduct = await Product.findOne({ _id: item._id });

    if (!dbProduct) {
      throw NotFoundError(`No product with id: ${item._id} was found.`);
    }

    if (dbProduct.price !== item.price) {
      throw BadRequestError(`Invalid price for product: ${dbProduct.name}`);
    }

    if (dbProduct.inventory < item.quantity) {
      throw BadRequestError(
        `Not enough inventory for ${dbProduct.name}. Available: ${dbProduct.inventory}`
      );
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

    processedOrderItems.push(singleOrderItem);
    serverSubtotal += price * item.quantity;
  }

  serverSubtotal = roundToTwoDecimals(serverSubtotal);

  const serverTax = Math.ceil(serverSubtotal * 0.21);
  const serverShippingFee = serverSubtotal > 200 ? 0 : 25;

  const serverTotal = roundToTwoDecimals(
    serverSubtotal + serverTax + serverShippingFee
  );

  // Verify calculation matches client calculation
  if (
    Math.abs(serverSubtotal - subtotal) > 0.01 ||
    serverTax !== tax ||
    serverShippingFee !== shippingFee ||
    Math.abs(serverTotal - total) > 0.01
  ) {
    throw BadRequestError("Order calculation mismatch. Please try again");
  }

  const order = await Order.create({
    tax: serverTax,
    shippingFee: serverShippingFee,
    subtotal: serverSubtotal,
    total: serverTotal,
    orderItems: processedOrderItems,
    deliveryAddress,
    contactInformation,
    paymentMethod,
    additionalInformation,
    clerkId: req.user?.clerkId,
    status: "pending",
  });

  // Update product inventory
  for (const item of orderItems) {
    await Product.findByIdAndUpdate(item._id, {
      $inc: { inventory: -item.quantity },
    });
  }

  res.status(StatusCodes.CREATED).json({ order });
};

const updateOrder = async (req: Request, res: Response): Promise<void> => {
  const { id: orderId } = req.params;
  const { status, deliveryAddress } = req.body;

  if (!status && !deliveryAddress) {
    throw BadRequestError(
      "Please provide status or delivery address to update"
    );
  }

  const order = await Order.findOne({ _id: orderId });

  if (!order) {
    throw NotFoundError(`No order with id: ${orderId}`);
  }

  if (status) {
    order.status = status;
  }

  if (deliveryAddress) {
    order.deliveryAddress = deliveryAddress;
  }

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
