"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cart_controller_1 = require("../controllers/cart.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
//! all cart routes require authentication
const auth = (0, auth_middleware_1.authenticate)(["USER", "ADMIN", "SUPER_ADMIN"]);
//! get cart
router.get("/", auth, cart_controller_1.getCart);
//! add to cart
router.post("/add", auth, cart_controller_1.addToCart);
//! remove item from cart
router.delete("/remove/:productId", auth, cart_controller_1.removeFromCart);
//! update item quantity
router.put("/update/:productId", auth, cart_controller_1.updateQuantity);
//! clear entire cart
router.delete("/clear", auth, cart_controller_1.clearCart);
exports.default = router;
