interface IReviewImage {
  url: string;
  filename: string;
}

export interface Review {
  _id: string;
  rating: number;
  title: string;
  comment: string;
  user: string;
  product: string;
  images: IReviewImage[];
  createdAt: Date;
  updatedAt: Date;
}
