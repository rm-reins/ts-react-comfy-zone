export type AppRouter = import("../../server/tRPC/routers/appRouter").AppRouter;

/**
 * Client-side product interface
 */
export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  company: string;
  featured: boolean;
  freeShipping: boolean;
  inventory: number;
  averageRating: number;
  numOfReviews: number;
  user: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Client-side delivery address interface
 */
export interface DeliveryAddress {
  address: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

/**
 * Client-side user interface
 */
export interface User {
  _id: string;
  name: string;
  surname: string;
  email: string;
  role: string;
  clerkId?: string;
  phoneNumber?: string;
  deliveryAddress?: DeliveryAddress;
  createdAt: string | Date;
  updatedAt: string | Date;
}

/**
 * Client-side order interface
 */
export interface Order {
  _id: string;
  tax: number;
  shippingFee: number;
  subtotal: number;
  total: number;
  orderItems: Array<{
    _id: string;
    name: string;
    price: number;
    image: string;
    quantity: number;
    color: string;
    size: string;
  }>;
  status: "pending" | "failed" | "paid" | "delivered" | "cancelled";
  user: string;
  paymentId?: string;
  createdAt: string | Date;
  updatedAt: string | Date;
}
