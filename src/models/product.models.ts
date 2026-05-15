import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      minLength: [3, "Name must be 3 char. long"],
      trim: true,
    },

    description: {
      type: String,
      required: [true, "description is required"],
      trim: true,
    },
  },
  { timestamps: true },
);

//! model
const Product = mongoose.model("product", productSchema);

export default Product;