import { Request, Response } from "express";
import Category from "../models/category.models";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import AppError from "../utils/appError.utils";
import {
  deleteFileFromCloudinary,
  sendFileToCloudinary,
} from "../utils/cloudinary.utils";

const folder = "/categories";

//! get all
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const categories = await Category.find({});

  sendResponse(res, {
    message: "categories fetched",
    data: categories,
    statusCode: 200,
  });
});

//! get by id
export const getById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);

  if (!category) throw new AppError(`category ${id} not found`, 404);

  sendResponse(res, {
    message: `category ${id} fetched`,
    data: category,
    statusCode: 200,
  });
});

//! create
export const create = catchAsync(async (req: Request, res: Response) => {
  const { name, description } = req.body;
  const image = req.file as Express.Multer.File;

  if (!name) throw new AppError("name is required", 400);
  if (!image) throw new AppError("image is required", 400);

  const { path, public_id } = await sendFileToCloudinary(image, folder);

  const category = new Category({
    name,
    description,

    category_logo: { path, public_id },
  });

  await category.save();

  sendResponse(res, {
    message: "category created",
    data: category,
    statusCode: 201,
  });
});

//! update
export const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const { name, description } = req.body;
  const image = req.file as Express.Multer.File;

  const category = await Category.findById(id);
  if (!category) throw new AppError(`category ${id} not found`, 404);

  if (name) category.name = name;
  if (description) category.description = description;

  if (image) {
    if (category.category_logo?.public_id) {
      await deleteFileFromCloudinary(category.category_logo.public_id);
    }
    const { path, public_id } = await sendFileToCloudinary(image, folder);

    category.category_logo = { path, public_id };
  }

  await category.save();

  sendResponse(res, {
    message: `category ${id} updated`,
    data: category,
    statusCode: 200,
  });
});

//! delete
export const remove = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await Category.findById(id);
  if (!category) throw new AppError(`category ${id} not found`, 404);

  if (category.category_logo?.public_id) {
    await deleteFileFromCloudinary(category.category_logo.public_id);
  }

  await category.deleteOne();

  sendResponse(res, {
    message: `category ${id} deleted`,
    data: null,
    statusCode: 200,
  });
});
