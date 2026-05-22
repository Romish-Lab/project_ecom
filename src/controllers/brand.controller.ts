import { Request, Response } from "express";
import Brand from "../models/brand.models";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { sendFileToCloudinary } from "../utils/claudinady.utils";
//! get all brands
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const filter = {};

  const brands = await Brand.find(filter);

  //! success response
  sendResponse(res, {
    message: "All brands fetched",
    data: brands,
    statusCode: 200,
  });
});

//! get brand by id
export const getById = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const brand = await Brand.findById(id);

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  //! success response
  sendResponse(res, {
    message: `Brand with ${id} fetched`,
    data: brand,
    statusCode: 200,
  });
});

//! create brand
export const createBrand = catchAsync(async (req: Request, res: Response) => {
  const body = req.body;
  const image = req.file;
  //* create brand
  const brand = await Brand.create(body);

  if (image) {
    const { path, public_id } = await sendFileToCloudinary(
      image,
      "/brand_logo",
    );
    brand.brand_logo = {
      path,
      public_id,
    };
  }
  //! success response
  sendResponse(res, {
    message: "Brand created successfully",
    data: brand,
    statusCode: 201,
  });
});

//! update brand
export const updateBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const body = req.body;

  const brand = await Brand.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  //! success response
  sendResponse(res, {
    message: `Brand with id ${id} updated successfully`,
    data: brand,
    statusCode: 200,
  });
});

//! delete brand
export const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const brand = await Brand.findByIdAndDelete(id);

  if (!brand) {
    throw new AppError("Brand not found", 404);
  }

  //! success response
  sendResponse(res, {
    message: "Brand deleted successfully",
    data: brand,
    statusCode: 200,
  });
});
