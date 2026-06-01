"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.updateQuantity = exports.removeFromCart = exports.addToCart = exports.getCart = void 0;
const cart_models_1 = __importDefault(require("../models/cart.models"));
const product_models_1 = __importDefault(require("../models/product.models"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
//! ========================== GET CART ==========================
exports.getCart = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const cart = await cart_models_1.default.findOne({ user: userId }).populate({
        path: "items.product",
        populate: ["category", "brand"],
    });
    if (!cart)
        throw new appError_utils_1.default("Cart not found", 404);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Cart fetched successfully",
        data: cart,
        statusCode: 200,
    });
});
//! ========================== ADD TO CART ==========================
exports.addToCart = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const { productId, quantity = 1 } = req.body;
    if (!productId)
        throw new appError_utils_1.default("Product id is required", 400);
    //! check product exists
    const product = await product_models_1.default.findById(productId);
    if (!product)
        throw new appError_utils_1.default("Product not found", 404);
    //! check stock
    if (product.stock < quantity) {
        throw new appError_utils_1.default(`Only ${product.stock} items left in stock`, 400);
    }
    let cart = await cart_models_1.default.findOne({ user: userId });
    if (!cart) {
        //! create new cart if user doesn't have one
        cart = new cart_models_1.default({
            user: userId,
            items: [{ product: productId, quantity }],
        });
    }
    else {
        //! check if product already exists in cart
        const existingItem = cart.items.find((item) => item.product.toString() === productId.toString());
        if (existingItem) {
            //! check stock for updated quantity
            if (product.stock < existingItem.quantity + quantity) {
                throw new appError_utils_1.default(`Only ${product.stock} items left in stock`, 400);
            }
            //! increase quantity if product already in cart
            existingItem.quantity += quantity;
        }
        else {
            //! add new item to cart
            cart.items.push({ product: productId, quantity });
        }
    }
    await cart.save();
    //! populate after save
    await cart.populate({
        path: "items.product",
        populate: ["category", "brand"],
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Item added to cart successfully",
        data: cart,
        statusCode: 200,
    });
});
//! ========================== REMOVE FROM CART ==========================
exports.removeFromCart = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const { productId } = req.params;
    const cart = await cart_models_1.default.findOne({ user: userId });
    if (!cart)
        throw new appError_utils_1.default("Cart not found", 404);
    //! check item exists in cart
    const itemExists = cart.items.find((item) => item.product.toString() === productId.toString());
    if (!itemExists)
        throw new appError_utils_1.default("Item not found in cart", 404);
    //! remove item from cart
    cart.items = cart.items.filter((item) => item.product.toString() !== productId.toString());
    await cart.save();
    //! populate after save
    await cart.populate({
        path: "items.product",
        populate: ["category", "brand"],
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Item removed from cart successfully",
        data: cart,
        statusCode: 200,
    });
});
//! ========================== UPDATE QUANTITY ==========================
exports.updateQuantity = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const { productId } = req.params;
    const { quantity } = req.body;
    //! validate quantity
    if (!quantity || quantity < 1) {
        throw new appError_utils_1.default("Quantity must be at least 1", 400);
    }
    //! check product exists
    const product = await product_models_1.default.findById(productId);
    if (!product)
        throw new appError_utils_1.default("Product not found", 404);
    //! check stock
    if (product.stock < quantity) {
        throw new appError_utils_1.default(`Only ${product.stock} items left in stock`, 400);
    }
    //! find cart
    const cart = await cart_models_1.default.findOne({ user: userId });
    if (!cart)
        throw new appError_utils_1.default("Cart not found", 404);
    //! find item in cart
    const item = cart.items.find((item) => item.product.toString() === productId.toString());
    if (!item)
        throw new appError_utils_1.default("Item not found in cart", 404);
    //! update quantity
    item.quantity = quantity;
    await cart.save();
    //! populate after save
    await cart.populate({
        path: "items.product",
        populate: ["category", "brand"],
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Cart quantity updated successfully",
        data: cart,
        statusCode: 200,
    });
});
//! ========================== CLEAR CART ==========================
exports.clearCart = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const userId = req.user?._id;
    const cart = await cart_models_1.default.findOne({ user: userId });
    if (!cart)
        throw new appError_utils_1.default("Cart not found", 404);
    //! empty cart items
    cart.items = [];
    await cart.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Cart cleared successfully",
        data: cart,
        statusCode: 200,
    });
});
