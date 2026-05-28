import { Request, Response } from "express";
import Product from "../models/product.models";

//! create product
export const createProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.create(req.body);

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//! get all products
export const getAllProducts = async (req: Request, res: Response) => {
  try {
    const products = await Product.find()
      .populate("category")
      .populate("brand")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//! get product by id
export const getProductById = async (req: Request, res: Response) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("brand");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//! update product
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true,
      },
    );

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated successfully",
      data: product,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//! delete product
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//! get products by category
export const getProductsByCategory = async (req: Request, res: Response) => {
  try {
    const products = await Product.find({
      category: req.params.categoryId,
    })
      .populate("category")
      .populate("brand");

    return res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//! get featured products
export const getFeaturedProducts = async (
  req: Request,
  res: Response,
) => {
  try {
    const products = await Product.find({
      featured: true,
    })
      .populate("category")
      .populate("brand")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

//! get new arrival products
export const getNewArrivals = async (
  req: Request,
  res: Response,
) => {
  try {
    const products = await Product.find({
      new_arrival: true,
    })
      .populate("category")
      .populate("brand")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      total: products.length,
      data: products,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};