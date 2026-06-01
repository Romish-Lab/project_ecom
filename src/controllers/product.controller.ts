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

const folder = "/product_images";

//
// ========================== CREATE PRODUCT ==========================
//
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
  if (!existingCategory) throw new AppError("Category not found", 404);

  const existingBrand = await Brand.findById(brand);
  if (!existingBrand) throw new AppError("Brand not found", 404);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  if (!files?.cover_image?.[0]) {
    throw new AppError("Cover image is required", 400);
  }

  //! upload cover image
  const { path: coverPath, public_id: coverPublicId } =
    await sendFileToCloudinary(files.cover_image[0], folder);

  //! upload multiple images
  let images: { path: string; public_id: string }[] = [];
  if (files?.images?.length) {
    const uploaded = await Promise.all(
      files.images.map((file) => sendFileToCloudinary(file, folder)),
    );
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

  await product.populate(["category", "brand"]);

  sendResponse(res, {
    message: "Product created successfully",
    data: product,
    statusCode: 201,
  });
});

//
// ========================== GET ALL PRODUCTS ==========================
//
export const getAllProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find()
      .populate("category")
      .populate("brand")
      .sort({ createdAt: -1 });

    sendResponse(res, {
      message: "Products fetched successfully",
      data: products,
      statusCode: 200,
    });
  },
);

//
// ========================== GET PRODUCT BY ID ==========================
//
export const getProductById = catchAsync(
  async (req: Request, res: Response) => {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("brand");

    if (!product) throw new AppError("Product not found", 404);

    sendResponse(res, {
      message: "Product fetched successfully",
      data: product,
      statusCode: 200,
    });
  },
);

//
// ========================== UPDATE PRODUCT ==========================
//
export const updateProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;

  const product = await Product.findById(id);
  if (!product) throw new AppError("Product not found", 404);

  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  //! handle cover image update
  if (files?.cover_image?.[0]) {
    if (product.cover_image?.public_id) {
      await deleteFileFromCloudinary(product.cover_image.public_id);
    }
    const { path, public_id } = await sendFileToCloudinary(
      files.cover_image[0],
      folder,
    );
    body.cover_image = { path, public_id };
  }

  //! handle multiple images update
  if (files?.images?.length) {
    if (product.images?.length) {
      await Promise.all(
        product.images.map((product_logo) => deleteFileFromCloudinary(product_logo.public_id)),
      );
    }
    const uploaded = await Promise.all(
      files.images.map((file) => sendFileToCloudinary(file, folder)),
    );
    body.images = uploaded.map(({ path, public_id }) => ({ path, public_id }));
  }

  const updatedProduct = await Product.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  }).populate(["category", "brand"]);

  sendResponse(res, {
    message: "Product updated successfully",
    data: updatedProduct,
    statusCode: 200,
  });
});

//
// ========================== DELETE PRODUCT ==========================
//
export const deleteProduct = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const product = await Product.findById(id);
  if (!product) throw new AppError("Product not found", 404);

  //! delete cover image from cloudinary
  if (product.cover_image?.public_id) {
    await deleteFileFromCloudinary(product.cover_image.public_id);
  }

  //! delete all extra images from cloudinary
  if (product.images?.length) {
    await Promise.all(
      product.images.map((img) => deleteFileFromCloudinary(img.public_id)),
    );
  }

  await Product.findByIdAndDelete(id);

  sendResponse(res, {
    message: "Product deleted successfully",
    data: null,
    statusCode: 200,
  });
});

//
// ========================== GET PRODUCTS BY CATEGORY ==========================
//
export const getProductsByCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { categoryId } = req.params;

    const existingCategory = await Category.findById(categoryId);
    if (!existingCategory) throw new AppError("Category not found", 404);

    const products = await Product.find({ category: categoryId })
      .populate("category")
      .populate("brand")
      .sort({ createdAt: -1 });

    sendResponse(res, {
      message: "Products fetched successfully",
      data: products,
      statusCode: 200,
    });
  },
);

//
// ========================== GET FEATURED PRODUCTS ==========================
//
export const getFeaturedProducts = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find({ featured: true })
      .populate("category")
      .populate("brand")
      .sort({ createdAt: -1 });

    sendResponse(res, {
      message: "Featured products fetched successfully",
      data: products,
      statusCode: 200,
    });
  },
);

//
// ========================== GET NEW ARRIVALS ==========================
//
export const getNewArrivals = catchAsync(
  async (req: Request, res: Response) => {
    const products = await Product.find({ new_arrival: true })
      .populate("category")
      .populate("brand")
      .sort({ createdAt: -1 });

    sendResponse(res, {
      message: "New arrivals fetched successfully",
      data: products,
      statusCode: 200,
    });
  },
);
