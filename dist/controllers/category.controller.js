"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.remove = exports.update = exports.create = exports.getById = exports.getAll = void 0;
const category_models_1 = __importDefault(require("../models/category.models"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const folder = "/categories";
//! get all
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const categories = await category_models_1.default.find({});
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "categories fetched",
        data: categories,
        statusCode: 200,
    });
});
//! get by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const category = await category_models_1.default.findById(id);
    if (!category)
        throw new appError_utils_1.default(`category ${id} not found`, 404);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `category ${id} fetched`,
        data: category,
        statusCode: 200,
    });
});
//! create
exports.create = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { name, description } = req.body;
    const image = req.file;
    if (!name)
        throw new appError_utils_1.default("name is required", 400);
    if (!image)
        throw new appError_utils_1.default("image is required", 400);
    const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
    const category = new category_models_1.default({
        name,
        description,
        category_logo: { path, public_id },
    });
    await category.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "category created",
        data: category,
        statusCode: 201,
    });
});
//! update
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const { name, description } = req.body;
    const image = req.file;
    const category = await category_models_1.default.findById(id);
    if (!category)
        throw new appError_utils_1.default(`category ${id} not found`, 404);
    if (name)
        category.name = name;
    if (description)
        category.description = description;
    if (image) {
        if (category.category_logo?.public_id) {
            await (0, cloudinary_utils_1.deleteFileFromCloudinary)(category.category_logo.public_id);
        }
        const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
        category.category_logo = { path, public_id };
    }
    await category.save();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `category ${id} updated`,
        data: category,
        statusCode: 200,
    });
});
//! delete
exports.remove = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const category = await category_models_1.default.findById(id);
    if (!category)
        throw new appError_utils_1.default(`category ${id} not found`, 404);
    if (category.category_logo?.public_id) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(category.category_logo.public_id);
    }
    await category.deleteOne();
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `category ${id} deleted`,
        data: null,
        statusCode: 200,
    });
});
