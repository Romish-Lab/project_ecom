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
const claudinady_utils_1 = require("../utils/claudinady.utils");
//! get all brands
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const filter = {};
    const brands = await brand_models_1.default.find(filter);
    //! success response
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
    if (!brand) {
        throw new appError_utils_1.default("Brand not found", 404);
    }
    //! success response
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
    //* create brand
    const brand = await brand_models_1.default.create(body);
    if (image) {
        const { path, public_id } = await (0, claudinady_utils_1.sendFileToCloudinary)(image, "/brand_logo");
        brand.brand_logo = {
            path,
            public_id,
        };
    }
    //! success response
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
    const exixtingBrand = await brand_models_1.default.findById({ _id: id });
    if (image) {
        if (exixtingBrand?.brand_logo?.public_id) {
            await (0, claudinady_utils_1.deleteFileFromCloudinary)(exixtingBrand.brand_logo.public_id);
        }
    }
    //* upload new image
    const { path, public_id } = await (0, claudinady_utils_1.sendFileToCloudinary)(image, "/brand_logo");
    const brand = await brand_models_1.default.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
    });
    if (!brand) {
        throw new appError_utils_1.default("Brand not found", 404);
    }
    //! success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Brand with id ${id} updated successfully`,
        data: brand,
        statusCode: 200,
    });
});
//! delete brand
exports.deleteBrand = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const brand = await brand_models_1.default.findByIdAndDelete(id);
    if (!brand) {
        throw new appError_utils_1.default("Brand not found", 404);
    }
    //* delete image if exist
    // const existingBrand = await Brand.findById({ _id: id });
    if (brand?.brand_logo?.public_id) {
        await (0, claudinady_utils_1.deleteFileFromCloudinary)(brand.brand_logo.public_id);
    }
    //! success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Brand deleted successfully",
        data: brand,
        statusCode: 200,
    });
});
