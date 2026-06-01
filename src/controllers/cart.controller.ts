import { Request, Response } from "express";
import Cart from "../models/cart.models";
import Product from "../models/product.models";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";

//! ========================== GET CART ==========================
export const getCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const cart = await Cart.findOne({ user: userId }).populate({
    path: "items.product",
    populate: ["category", "brand"],
  });

  if (!cart) throw new AppError("Cart not found", 404);

  sendResponse(res, {
    message: "Cart fetched successfully",
    data: cart,
    statusCode: 200,
  });
});

//! ========================== ADD TO CART ==========================
export const addToCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) throw new AppError("Product id is required", 400);

  //! check product exists
  const product = await Product.findById(productId);
  if (!product) throw new AppError("Product not found", 404);

  //! check stock
  if (product.stock < quantity) {
    throw new AppError(`Only ${product.stock} items left in stock`, 400);
  }

  let cart = await Cart.findOne({ user: userId });

  if (!cart) {
    //! create new cart if user doesn't have one
    cart = new Cart({
      user: userId,
      items: [{ product: productId, quantity }],
    });
  } else {
    //! check if product already exists in cart
    const existingItem = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );

    if (existingItem) {
      //! check stock for updated quantity
      if (product.stock < existingItem.quantity + quantity) {
        throw new AppError(`Only ${product.stock} items left in stock`, 400);
      }
      //! increase quantity if product already in cart
      existingItem.quantity += quantity;
    } else {
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

  sendResponse(res, {
    message: "Item added to cart successfully",
    data: cart,
    statusCode: 200,
  });
});

//! ========================== REMOVE FROM CART ==========================
export const removeFromCart = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new AppError("Cart not found", 404);

    //! check item exists in cart
    const itemExists = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (!itemExists) throw new AppError("Item not found in cart", 404);

    //! remove item from cart
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId.toString(),
    );

    await cart.save();

    //! populate after save
    await cart.populate({
      path: "items.product",
      populate: ["category", "brand"],
    });

    sendResponse(res, {
      message: "Item removed from cart successfully",
      data: cart,
      statusCode: 200,
    });
  },
);

//! ========================== UPDATE QUANTITY ==========================
export const updateQuantity = catchAsync(
  async (req: Request, res: Response) => {
    const userId = req.user?._id;
    const { productId } = req.params;
    const { quantity } = req.body;

    //! validate quantity
    if (!quantity || quantity < 1) {
      throw new AppError("Quantity must be at least 1", 400);
    }

    //! check product exists
    const product = await Product.findById(productId);
    if (!product) throw new AppError("Product not found", 404);

    //! check stock
    if (product.stock < quantity) {
      throw new AppError(`Only ${product.stock} items left in stock`, 400);
    }

    //! find cart
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new AppError("Cart not found", 404);

    //! find item in cart
    const item = cart.items.find(
      (item) => item.product.toString() === productId.toString(),
    );
    if (!item) throw new AppError("Item not found in cart", 404);

    //! update quantity
    item.quantity = quantity;

    await cart.save();

    //! populate after save
    await cart.populate({
      path: "items.product",
      populate: ["category", "brand"],
    });

    sendResponse(res, {
      message: "Cart quantity updated successfully",
      data: cart,
      statusCode: 200,
    });
  },
);

//! ========================== CLEAR CART ==========================
export const clearCart = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?._id;

  const cart = await Cart.findOne({ user: userId });
  if (!cart) throw new AppError("Cart not found", 404);

  //! empty cart items
  cart.items = [];

  await cart.save();

  sendResponse(res, {
    message: "Cart cleared successfully",
    data: cart,
    statusCode: 200,
  });
});
