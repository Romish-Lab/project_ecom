import { Request, Response } from "express";
import Brand from "../models/brand.models";
import AppError from "../utils/appError.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import {
  deleteFileFromCloudinary,
  sendFileToCloudinary,
} from "../utils/claudinady.utils";

const folder = "/brand_logo";

//! get all brands
export const getAll = catchAsync(async (req: Request, res: Response) => {
  const brands = await Brand.find({});

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

  if (!brand) throw new AppError("Brand not found", 404);

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

  const brand = await Brand.create(body);

  if (image) {
    const { path, public_id } = await sendFileToCloudinary(image, folder);
    brand.brand_logo = { path, public_id };
    // ✅ Fixed: brand.save() was missing — image was uploaded but never persisted
    await brand.save();
  }

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
  const image = req.file as Express.Multer.File;

  // ✅ Fixed: check brand exists before doing anything
  const existingBrand = await Brand.findById(id);
  if (!existingBrand) throw new AppError("Brand not found", 404);

  if (image) {
    // ✅ Fixed: delete old image from cloudinary if exists
    if (existingBrand?.brand_logo?.public_id) {
      await deleteFileFromCloudinary(existingBrand.brand_logo.public_id);
    }

    // ✅ Fixed: new image path/public_id was never saved to body before
    const { path, public_id } = await sendFileToCloudinary(image, folder);
    body.brand_logo = { path, public_id };
  }

  const updatedBrand = await Brand.findByIdAndUpdate(id, body, {
    new: true,
    runValidators: true,
  });

  sendResponse(res, {
    message: `Brand with id ${id} updated successfully`,
    data: updatedBrand,
    statusCode: 200,
  });
});

//! delete brand
export const deleteBrand = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  // ✅ Fixed: find first then delete so we can access brand_logo before it's gone
  const brand = await Brand.findById(id);
  if (!brand) throw new AppError("Brand not found", 404);

  // ✅ Fixed: delete image from cloudinary BEFORE deleting from DB
  if (brand?.brand_logo?.public_id) {
    await deleteFileFromCloudinary(brand.brand_logo.public_id);
  }

  await Brand.findByIdAndDelete(id);

  sendResponse(res, {
    message: "Brand deleted successfully",
    data: brand,
    statusCode: 200,
  });
});
