import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "name is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      minLength: [25, "atleat 25 char. required"],
    },
    price: {
      type: String,
      required: [true, "price is required"],
    },
    stock: {
      type: Number,
      required: [true, "stock is required"],
    },
    cover_image: {
      type: {
        path: {
          type: String,
          required: true,
        },
        public_id: {
          type: String,
          required: true,
        },
      },
      required: [true, "cover_image is required"],
    },
    images: [
      {
        type: {
          path: {
            type: String,
            required: true,
          },
          public_id: {
            type: String,
            required: true,
          },
        },
      },
    ],
    //! category : 6a0afd1dc56c20e218d7fcde  / {}
    category: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "category is required"],
      ref: "category",
    },

    //! brand
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      required: [true, "brand is required"],
      ref: "brand",
    },
    new_arrival: {
      type: Boolean,
      default: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

//! model
const Product = mongoose.model("product", productSchema);
export default Product;
