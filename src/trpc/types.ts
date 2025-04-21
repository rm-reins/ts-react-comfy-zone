export type AppRouter = import("../../server/tRPC/routers/appRouter").AppRouter;

export interface Product {
  _id: string;
  name: string;
  price: number;
  description: string;
  images: string[];
  category:
    | "office"
    | "kitchen"
    | "bedroom"
    | "home decor"
    | "storage"
    | "textiles"
    | "other";
  company: string;
  colors: string[];
  featured: boolean;
  inventory: number;
  averageRating: number;
  numOfReviews: number;
  user: string;
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}

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
  role: string;
  deliveryAddresses?: DeliveryAddress[];
  createdAt: Date;
  updatedAt: Date;
}

export interface OrderItem {
  _id?: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color: string;
}

export interface Order {
  _id?: string;
  tax: number;
  shippingFee: number;
  subtotal: number;
  total: number;
  orderItems: OrderItem[];
  paymentId?: string;
  status?: "pending" | "paid" | "delivered" | "cancelled";
  user?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  _id: string;
  clerkId: string;
  rating: number;
  title: string;
  comment: string;
  user: string;
  product: string;
  userName?: string;
  userSurname?: string;
  createdAt: Date;
  updatedAt: Date;
}
