import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

interface IDeliveryAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

interface IUser extends Document {
  name: string;
  surname: string;
  email: string;
  phone: string;
  clerkId?: string;
  role: string;
  deliveryAddress: IDeliveryAddress;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const DeliveryAddressSchema = new Schema<IDeliveryAddress>({
  street: {
    type: String,
    required: [true, "Please provide street address"],
  },
  city: {
    type: String,
    required: [true, "Please provide city"],
  },
  state: {
    type: String,
    required: [true, "Please provide state/province"],
  },
  postalCode: {
    type: String,
    required: [true, "Please provide postal code"],
  },
  country: {
    type: String,
    required: [true, "Please provide country"],
    default: "Germany",
  },
});

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
      minLength: [2, "Name must be at least 2 characters long"],
      maxLength: [50, "Name must be less than 50 characters long"],
    },
    surname: {
      type: String,
      required: [true, "Please provide your surname"],
      minLength: [2, "Surname must be at least 2 characters long"],
      maxLength: [50, "Surname must be less than 50 characters long"],
    },
    email: {
      type: String,
      required: [true, "Please provide your email"],
      validate: [validator.isEmail, "Please provide a valid email"],
      unique: true,
    },
    phone: {
      type: String,
      unique: true,
    },
    clerkId: {
      type: String,
      unique: true,
      sparse: true,
    },
    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    deliveryAddress: DeliveryAddressSchema,
    phoneNumber: {
      type: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model<IUser>("User", UserSchema);

export { User, IUser };
