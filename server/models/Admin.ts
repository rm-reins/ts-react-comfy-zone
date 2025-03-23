import mongoose, { Schema, Document } from "mongoose";
import validator from "validator";

interface IAdmin extends Document {
  name: string;
  surname: string;
  email: string;
  phone: string;
  clerkId?: string;
  role: string;
  phoneNumber: string;
  createdAt: Date;
  updatedAt: Date;
}

const AdminSchema = new Schema<IAdmin>(
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
      enum: ["admin"],
      default: "admin",
    },
  },
  { timestamps: true }
);

const Admin = mongoose.model<IAdmin>("Admin", AdminSchema);

export { Admin, IAdmin };
