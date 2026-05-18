import { Request, Response, NextFunction } from "express";
import Category from "../models/category.models";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";

//! get all category
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const filter = {};

  const category = await Category.find(filter);

  //! success response
  sendResponse(res, {
    message: "All category fetched",
    data: category,
    statusCode: 200,
  });
});

//! get by id
export const getById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await Category.findOne({ _id: id });

  if (!user) {
    throw new AppError("Category not found", 404);
  }

  //! success response
  sendResponse(res, {
    message: `category with ${id} fetched`,
    data: user,
    statusCode: 200,
  });
});

//! create category
export const create = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;

  //* create category
  const category = await Category.create(body);

  //! success response
  sendResponse(res, {
    message: "Category created successfully",
    data: category,
    statusCode: 201,
  });
});

//! delete category
export const deleteCategory = catchAsync(
  async (req: Request, res: Response) => {
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
  },
);

//! update category
export const updateCategory = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;

    const body = req.body;

    const category = await Category.findByIdAndUpdate(id, body, {
      new: true,
    });

    if (!category) {
      throw new AppError("Category not found", 404);
    }

    sendResponse(res, {
      message: `category with id ${id} updated successfully`,
      data: category,
      statusCode: 200,
    });
  },
);