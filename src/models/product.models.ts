import mongoose, { Document, Schema } from "mongoose";
interface IImage {
  path: string;
  public_id: string;
}


export interface IProduct extends Document {
  name: string;
  description?: string;
  price: number;
  stock: number;
  category: mongoose.Types.ObjectId;
  brand: mongoose.Types.ObjectId;
  new_arrival: boolean;
  featured: boolean;
  cover_image: IImage;
  images: IImage[];
  createdAt: Date;
  updatedAt: Date;
} 


const productSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: [25, "atleast 25 char. required"],
    },
    
    price: {
      type: Number,
      required: [true, "price is required"],
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
    },
    cover_image: {
      type: {
        path: { type: String, default: "" },
        public_id: { type: String, default: "" },
      },
      required: [true, "cover_image is required"],
    },
    
    images: [
      {
        path: { type: String, default: "" },
        public_id: { type: String, default: "" },
      },
    ],
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "category is required"],
      ref: "Category", 
    },
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "brand is required"],
      ref: "Brand", 
    },
    new_arrival: {
      type: Boolean,
      default: false, 
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model<IProduct>("Product", productSchema);
export default Product;