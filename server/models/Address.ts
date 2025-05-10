import mongoose, { Schema } from "mongoose";

interface IDeliveryAddress {
  firstName: string;
  lastName: string;
  street: string;
  city: string;
  state?: string;
  postalCode: string;
  country: string;
  clerkId: string;
  isDefault: boolean;
}

const DeliveryAddressSchema = new Schema<IDeliveryAddress>({
  firstName: {
    type: String,
    required: [true, "Please provide first name"],
  },
  lastName: {
    type: String,
    required: [true, "Please provide last name"],
  },
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
  },
  postalCode: {
    type: String,
    required: [true, "Please provide postal code"],
  },
  country: {
    type: String,
    required: [true, "Please provide country"],
  },
  clerkId: {
    type: String,
  },
  isDefault: {
    type: Boolean,
    default: false,
  },
});

const Address = mongoose.model<IDeliveryAddress>(
  "Address",
  DeliveryAddressSchema
);

export { Address, IDeliveryAddress };
