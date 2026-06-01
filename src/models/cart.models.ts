import mongoose, { Document, Schema } from "mongoose";

//! interface for cart item
interface ICartItem {
  product: mongoose.Types.ObjectId;
  quantity: number;
}

//! main cart interface
export interface ICart extends Document {
  user: mongoose.Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: [true, "user is required"],
    },
    items: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "product",
          required: [true, "product is required"],
        },
        quantity: {
          type: Number,
          default: 1,
          min: 1,
        },
      },
    ],
  },
  { timestamps: true },
);

//! cart model
const Cart = mongoose.model<ICart>("cart", cartSchema);
export default Cart;
