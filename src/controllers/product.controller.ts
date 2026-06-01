import { Request, Response } from "express";
import Product from "../models/product.models";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import {
  deleteFileFromCloudinary,
  sendFileToCloudinary,
} from "../utils/cloudinary.utils";
import Category from "../models/category.models";
import Brand from "../models/brand.models";
export const createProduct = catchAsync(async (req: Request, res: Response) => {
  const {
    name,
    description,
    price,
    stock,
    category,
    brand,
    new_arrival,
    featured,
  } = req.body;

  const existingCategory = await Category.findById(category);
  if (!existingCategory) {
    throw new AppError("Category not found", 404);
  }

  const existingBrand = await Brand.findById(brand);
  if (!existingBrand) {
    throw new AppError("Brand not found", 404);
  }

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files?.cover_image?.[0]) {
    throw new AppError("Cover image is required", 400);
  }
  //! handle cover image
  const { path: coverPath, public_id: coverPublicId } =
    await sendFileToCloudinary(files.cover_image[0], "/product_images");
  //! handle multiple images
  let images: { path: string; public_id: string }[] = [];
  if (files?.images?.length) {
    const uploadPromises = files.images.map((file) =>
      sendFileToCloudinary(file, "/product_images"),
    );
    const uploaded = await Promise.all(uploadPromises);
    images = uploaded.map(({ path, public_id }) => ({ path, public_id }));
  }
  //! create product
  const product = await Product.create({
    name,
    description,
    price,
    stock,
    category,
    brand,
    new_arrival,
    featured,
    cover_image: { path: coverPath, public_id: coverPublicId },
    images,
  });

  //! populate category and brand
  await product.populate(["category", "brand"]);

  sendResponse(res, {
    message: "Product created successfully",
    data: product,
    statusCode: 201,
  });
});
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
    const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

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
export const getFeaturedProducts = async (req: Request, res: Response) => {
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
export const getNewArrivals = async (req: Request, res: Response) => {
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
