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
  createdAt: Date;
  updatedAt: Date;
  __v: number;
}
