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
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
  size: string;
  _id: string;
}

export interface Order {
  _id: string;
  tax: number;
  shippingFee: number;
  subtotal: number;
  total: number;
  orderItems: OrderItem[];
  paymentId: string;
  status: "pending" | "failed" | "paid" | "delivered" | "cancelled";
  user: string;
  createdAt: Date;
  updatedAt: Date;
}
