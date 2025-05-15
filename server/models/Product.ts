import mongoose, { Document, Schema } from "mongoose";

interface IProduct extends Document {
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
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: {
        enUS: String,
        ruRU: String,
        deDE: String,
      },
      trim: true,
      required: [true, "Please provide product name"],
      maxLength: [100, "Name cannot be more than 100 characters"],
    },
    price: {
      type: Number,
      required: [true, "Please provide product price"],
      default: 0,
    },
    description: {
      type: {
        enUS: String,
        ruRU: String,
        deDE: String,
      },
      required: [true, "Please provide product description"],
      maxLength: [1000, "Description cannot be more than 1000 characters"],
    },
    images: [
      {
        type: String,
      },
    ],
    category: {
      type: String,
      required: [true, "Please provide product category"],
      enum: [
        "office",
        "kitchen",
        "bedroom",
        "homeDecor",
        "storage",
        "textiles",
        "other",
      ],
    },
    company: {
      type: String,
      required: [true, "Please provide product company"],
    },
    colors: {
      type: [String],
      default: ["#222"],
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    inventory: {
      type: Number,
      required: true,
      default: 0,
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    user: {
      type: String,
      required: true,
    },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

ProductSchema.virtual("reviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
  justOne: false,
});

ProductSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function () {
    await this.model("Review").deleteMany({ product: this._id });
  }
);

export default mongoose.model<IProduct>("Product", ProductSchema);
