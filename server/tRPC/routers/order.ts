import { router, protectedProcedure, adminProcedure } from "../trpc.js";
import { z } from "zod";
import Order from "../../models/Order.js";
import Product from "../../models/Product.js";
import { TRPCError } from "@trpc/server";

const orderItemSchema = z.object({
  name: z.string(),
  price: z.number(),
  image: z.string(),
  quantity: z.number().min(1),
  color: z.string(),
  size: z.string(),
  _id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
});

const orderSchema = z.object({
  _id: z
    .string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .optional(),
  tax: z.number().min(0),
  shippingFee: z.number().min(0),
  subtotal: z.number().min(0),
  total: z.number().min(0),
  orderItems: z.array(orderItemSchema),
  paymentId: z.string().optional(),
  status: z
    .enum(["pending", "failed", "paid", "delivered", "cancelled"])
    .default("pending"),
  user: z.string().optional(),
  createdAt: z.date().optional(),
  updatedAt: z.date().optional(),
});

export const orderRouter = router({
  getAllOrders: adminProcedure.query(async () => {
    try {
      const orders = await Order.find({});

      return orders;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch orders",
        cause: error,
      });
    }
  }),

  getCurrentUserOrders: protectedProcedure.query(async ({ ctx }) => {
    try {
      const orders = await Order.find({ user: ctx.user?.clerkId });

      return orders;
    } catch (error) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "Failed to fetch user orders",
        cause: error,
      });
    }
  }),

  getSingleOrder: protectedProcedure
    .input(z.string().regex(/^[0-9a-fA-F]{24}$/))
    .query(async ({ ctx, input: orderId }) => {
      try {
        const order = await Order.findById(orderId);

        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No order with id: ${orderId}`,
          });
        }

        if (
          ctx.user?.role !== "admin" &&
          order.user.toString() !== ctx.user?.clerkId
        ) {
          throw new TRPCError({
            code: "FORBIDDEN",
            message: "You are not authorized to view this order",
          });
        }

        return order;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to fetch order",
          cause: error,
        });
      }
    }),

  createOrder: protectedProcedure
    .input(orderSchema)
    .mutation(async ({ ctx, input }) => {
      try {
        const { orderItems } = input;

        if (!orderItems || orderItems.length < 1) {
          throw new TRPCError({
            code: "BAD_REQUEST",
            message: "Order has no items",
          });
        }

        const processedOrderItems: object[] = [];
        let subtotal = 0;
        let shippingFee = 0;

        for (const item of orderItems) {
          const dbProduct = await Product.findOne({ _id: item._id });

          if (!dbProduct) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `No product with id: ${item._id} was found.`,
            });
          }

          const { name, price, _id } = dbProduct;

          const singleOrderItem = {
            quantity: item.quantity,
            name,
            price,
            image: item.image,
            _id,
            color: item.color,
            size: item.size,
          };

          processedOrderItems.push(singleOrderItem);
          subtotal += price * item.quantity;
        }

        const tax = Math.ceil(subtotal * 0.15);
        shippingFee = subtotal > 10000 ? 0 : 700;
        const total = subtotal + tax + shippingFee;

        const order = await Order.create({
          tax,
          shippingFee,
          subtotal,
          total,
          orderItems: processedOrderItems,
          user: ctx.user?.clerkId,
        });

        return order;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create order",
          cause: error,
        });
      }
    }),

  updateOrder: adminProcedure
    .input(
      z.object({
        orderId: z.string().regex(/^[0-9a-fA-F]{24}$/),
        orderStatus: z.enum([
          "pending",
          "failed",
          "paid",
          "delivered",
          "cancelled",
        ]),
      })
    )
    .mutation(async ({ input }) => {
      try {
        const { orderId, orderStatus } = input;

        const order = await Order.findOneAndUpdate(
          { _id: orderId },
          { status: orderStatus },
          {
            new: true,
            runValidators: true,
          }
        );

        if (!order) {
          throw new TRPCError({
            code: "NOT_FOUND",
            message: `No order with id: ${orderId}`,
          });
        }

        return order;
      } catch (error) {
        if (error instanceof TRPCError) throw error;

        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to update order",
          cause: error,
        });
      }
    }),
});
