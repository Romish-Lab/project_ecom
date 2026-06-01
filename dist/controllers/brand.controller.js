"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.createBrand = exports.getById = exports.getAll = void 0;
const brand_models_1 = __importDefault(require("../models/brand.models"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const folder = "/brand_logo";
//! get all brands
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const brands = await brand_models_1.default.find({});
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "All brands fetched",
        data: brands,
        statusCode: 200,
    });
});
//! get brand by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const brand = await brand_models_1.default.findById(id);
    if (!brand)
        throw new appError_utils_1.default("Brand not found", 404);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Brand with ${id} fetched`,
        data: brand,
        statusCode: 200,
    });
});
//! create brand
exports.createBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const body = req.body;
    const image = req.file;
    const brand = await brand_models_1.default.create(body);
    if (image) {
        const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
        brand.brand_logo = { path, public_id };
        // ✅ Fixed: brand.save() was missing — image was uploaded but never persisted
        await brand.save();
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Brand created successfully",
        data: brand,
        statusCode: 201,
    });
});
//! update brand
exports.updateBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const image = req.file;
    // ✅ Fixed: check brand exists before doing anything
    const existingBrand = await brand_models_1.default.findById(id);
    if (!existingBrand)
        throw new appError_utils_1.default("Brand not found", 404);
    if (image) {
        // ✅ Fixed: delete old image from cloudinary if exists
        if (existingBrand?.brand_logo?.public_id) {
            await (0, cloudinary_utils_1.deleteFileFromCloudinary)(existingBrand.brand_logo.public_id);
        }
        // ✅ Fixed: new image path/public_id was never saved to body before
        const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
        body.brand_logo = { path, public_id };
    }
    const updatedBrand = await brand_models_1.default.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Brand with id ${id} updated successfully`,
        data: updatedBrand,
        statusCode: 200,
    });
});
//! delete brand
exports.deleteBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    // ✅ Fixed: find first then delete so we can access brand_logo before it's gone
    const brand = await brand_models_1.default.findById(id);
    if (!brand)
        throw new appError_utils_1.default("Brand not found", 404);
    // ✅ Fixed: delete image from cloudinary BEFORE deleting from DB
    if (brand?.brand_logo?.public_id) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(brand.brand_logo.public_id);
    }
    await brand_models_1.default.findByIdAndDelete(id);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Brand deleted successfully",
        data: brand,
        statusCode: 200,
    });
});
