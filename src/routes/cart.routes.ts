import express from "express";
import {
  getCart,
  addToCart,
  removeFromCart,
  updateQuantity,
  clearCart,
} from "../controllers/cart.controller";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

//! all cart routes require authentication
const auth = authenticate(["USER", "ADMIN", "SUPER_ADMIN"]);

//! get cart
router.get("/", auth, getCart);

//! add to cart
router.post("/add", auth, addToCart);

//! remove item from cart
router.delete("/remove/:productId", auth, removeFromCart);

//! update item quantity
router.put("/update/:productId", auth, updateQuantity);

//! clear entire cart
router.delete("/clear", auth, clearCart);

export default router;