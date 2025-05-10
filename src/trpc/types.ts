export type AppRouter = import("../../server/tRPC/routers/appRouter").AppRouter;

export interface Product {
  _id: string;
  name: {
    enUS: string;
    ruRU: string;
    deDE: string;
  };
  price: number;
  description: {
    enUS: string;
    ruRU: string;
    deDE: string;
  };
  images: string[];
  category:
    | "office"
    | "kitchen"
    | "bedroom"
    | "homeDecor"
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
  createdAt?: Date;
  updatedAt?: Date;
  __v?: number;
}

export interface DeliveryAddress {
  _id: string;
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

export interface Admin {
  _id: string;
  name: string;
  surname: string;
  email: string;
  phone?: string;
  role: string;
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
  deliveryAddress: {
    street: string;
    city: string;
    state?: string;
    postalCode: string;
    country: string;
  };
  contactInformation: {
    name: string;
    surname: string;
    email: string;
    phone: string;
  };
  paymentMethod: string;
  status?: "pending" | "paid" | "delivered" | "cancelled";
  clerkId?: string;
  additionalInformation?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Review {
  _id: string;
  clerkId: string;
  rating: number;
  title: string;
  comment: string;
  product: string;
  userName?: string;
  userSurname?: string;
  createdAt: Date;
  updatedAt: Date;
}
