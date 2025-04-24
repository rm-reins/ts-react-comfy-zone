import mongoose, { Document, Schema } from "mongoose";

interface ISingleOrderItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
}

interface IOrder extends Document {
  tax: number;
  shippingFee: number;
  subtotal: number;
  total: number;
  orderItems: ISingleOrderItem[];
  deliveryAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  contactInformation: {
    name: string;
    surname: string;
    email: string;
    phone: string;
  };
  status: "pending" | "paid" | "delivered" | "cancelled";
  paymentMethod: string;
  user: string;
  additionalInformation?: string;
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
      enum: ["pending", "paid", "delivered", "cancelled"],
      default: "pending",
    },
    deliveryAddress: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      state: {
        type: String,
      },
      postalCode: {
        type: String,
        required: true,
      },
      country: {
        type: String,
        required: true,
      },
    },
    contactInformation: {
      name: {
        type: String,
        required: true,
      },
      surname: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      phone: {
        type: String,
      },
    },
    paymentMethod: {
      type: String,
      required: true,
    },
    user: {
      type: String,
    },
    additionalInformation: {
      type: String,
    },
  },
  { timestamps: true }
);

export default mongoose.model<IOrder>("Order", OrderSchema);
