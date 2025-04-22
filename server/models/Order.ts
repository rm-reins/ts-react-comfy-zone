import mongoose, { Document, Schema } from "mongoose";

interface ISingleOrderItem {
  _id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
}

interface IOrder extends Document {
  _id: string;
  tax: number;
  shippingFee: number;
  subtotal: number;
  total: number;
  orderItems: ISingleOrderItem[];
  deliveryAddress: object;
  status: "pending" | "paid" | "delivered" | "cancelled";
  paymentId: string;
  user: string;
  createdAt: Date;
  updatedAt: Date;
}

const SingleOrderItemSchema = new Schema<ISingleOrderItem>({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  quantity: {
    type: Number,
    required: true,
  },
  color: {
    type: String,
    required: true,
  },
});

const OrderSchema = new Schema<IOrder>(
  {
    tax: {
      type: Number,
      required: true,
    },
    shippingFee: {
      type: Number,
      required: true,
    },
    subtotal: {
      type: Number,
      required: true,
    },
    total: {
      type: Number,
      required: true,
    },
    orderItems: [SingleOrderItemSchema],
    status: {
      type: String,
      enum: ["pending", "failed", "paid", "delivered", "cancelled"],
      default: "pending",
    },
    paymentId: {
      type: String,
    },
    user: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
