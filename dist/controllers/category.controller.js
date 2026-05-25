"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.create = exports.getById = exports.getAll = void 0;
const category_models_1 = __importDefault(require("../models/category.models"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const claudinady_utils_1 = require("../utils/claudinady.utils");
//! get all categories
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const category = await category_models_1.default.find({});
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "All categories fetched",
        data: category,
        statusCode: 200,
    });
});
//! get category by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const category = await category_models_1.default.findById(id);
    if (!category) {
        throw new appError_utils_1.default("Category not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Category with id ${id} fetched`,
        data: category,
        statusCode: 200,
    });
});
//! create category
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const body = req.body;
    const image = req.file;
    const category = await category_models_1.default.create(body);
    if (image) {
        const { path, public_id } = await (0, claudinady_utils_1.sendFileToCloudinary)(image, "/category_logo");
        category.category_logo = { path, public_id };
        await category.save();
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Category created successfully",
        data: category,
        statusCode: 201,
    });
});
//! update category
exports.updateCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const image = req.file;
    const existingCategory = await category_models_1.default.findById({ _id: id });
    if (image) {
        if (existingCategory?.category_logo?.public_id) {
            await (0, claudinady_utils_1.deleteFileFromCloudinary)(existingCategory.category_logo.public_id);
        }
    }
    //* upload new image
    const { path, public_id } = await (0, claudinady_utils_1.sendFileToCloudinary)(image, "/category_logo");
    // if (image) {
    //   const { path, public_id } = await sendFileToCloudinary(image, "/category_logo");
    //   category.category_logo = { path, public_id };
    //   await category.save();
    // }
    const category = await category_models_1.default.findByIdAndUpdate(id, body, { new: true });
    if (!category) {
        throw new appError_utils_1.default("Category not found", 404);
    }
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `Category with id ${id} updated successfully`,
        data: category,
        statusCode: 200,
    });
});
//! delete category
exports.deleteCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    let category = await category_models_1.default.findById(id);
    if (!category) {
        throw new appError_utils_1.default("Category not found", 404);
    }
    //! delete image from cloudinary if exists
    if (category.category_logo?.public_id) {
        await (0, claudinady_utils_1.deleteFileFromCloudinary)(category.category_logo.public_id);
    }
    //! delete category from DB
    await category_models_1.default.findByIdAndDelete(id);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Category deleted successfully",
        data: category,
        statusCode: 200,
    });
});
