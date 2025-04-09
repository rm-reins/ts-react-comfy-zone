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
