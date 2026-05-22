import { Request, Response } from "express";
import Category from "../models/category.models";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { sendFileToCloudinary } from "../utils/claudinady.utils";

//! get all categories
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const category = await Category.find({});

  sendResponse(res, {
    message: "All categories fetched",
    data: category,
    statusCode: 200,
  });
});

//! get category by id
export const getById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  sendResponse(res, {
    message: `Category with id ${id} fetched`,
    data: category,
    statusCode: 200,
  });
});

//! create category
export const create = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const image = req.file;

  const category = await Category.create(body);

  if (image) {
    const { path, public_id } = await sendFileToCloudinary(image, "/category_logo");
    category.category_logo = { path, public_id };
    await category.save();
  }

  sendResponse(res, {
    message: "Category created successfully",
    data: category,
    statusCode: 201,
  });
});

//! update category
export const updateCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;
  const image = req.file as Express.Multer.File;

  const category = await Category.findByIdAndUpdate(id, body, { new: true });

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  // if (image) {
  //   const { path, public_id } = await sendFileToCloudinary(image, "/category_logo");
  //   category.category_logo = { path, public_id };
  //   await category.save();
  // }

  sendResponse(res, {
    message: `Category with id ${id} updated successfully`,
    data: category,
    statusCode: 200,
  });
});

//! delete category
export const deleteCategory = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findByIdAndDelete(id);

  if (!category) {
    throw new AppError("Category not found", 404);
  }

  sendResponse(res, {
    message: "Category deleted successfully",
    data: category,
    statusCode: 200,
  });
});