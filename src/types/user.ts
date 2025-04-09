export interface DeliveryAddress {
  _id: string;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  clerkId?: string;
  role: "user";
  deliveryAddresses?: DeliveryAddress[];
  createdAt: Date;
  updatedAt: Date;
}
