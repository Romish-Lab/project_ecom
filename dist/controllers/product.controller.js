"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getNewArrivals = exports.getFeaturedProducts = exports.getProductsByCategory = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getAllProducts = exports.createProduct = void 0;
const product_models_1 = __importDefault(require("../models/product.models"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const category_models_1 = __importDefault(require("../models/category.models"));
const brand_models_1 = __importDefault(require("../models/brand.models"));
const folder = "/product_images";
//
// ========================== CREATE PRODUCT ==========================
//
exports.createProduct = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { name, description, price, stock, category, brand, new_arrival, featured, } = req.body;
    const existingCategory = await category_models_1.default.findById(category);
    if (!existingCategory)
        throw new appError_utils_1.default("Category not found", 404);
    const existingBrand = await brand_models_1.default.findById(brand);
    if (!existingBrand)
        throw new appError_utils_1.default("Brand not found", 404);
    const files = req.files;
    if (!files?.cover_image?.[0]) {
        throw new appError_utils_1.default("Cover image is required", 400);
    }
    //! upload cover image
    const { path: coverPath, public_id: coverPublicId } = await (0, cloudinary_utils_1.sendFileToCloudinary)(files.cover_image[0], folder);
    //! upload multiple images
    let images = [];
    if (files?.images?.length) {
        const uploaded = await Promise.all(files.images.map((file) => (0, cloudinary_utils_1.sendFileToCloudinary)(file, folder)));
        images = uploaded.map(({ path, public_id }) => ({ path, public_id }));
    }
    //! create product
    const product = await product_models_1.default.create({
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
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product created successfully",
        data: product,
        statusCode: 201,
    });
});
//
// ========================== GET ALL PRODUCTS ==========================
//
exports.getAllProducts = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_models_1.default.find()
        .populate("category")
        .populate("brand")
        .sort({ createdAt: -1 });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Products fetched successfully",
        data: products,
        statusCode: 200,
    });
});
//
// ========================== GET PRODUCT BY ID ==========================
//
exports.getProductById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const product = await product_models_1.default.findById(req.params.id)
        .populate("category")
        .populate("brand");
    if (!product)
        throw new appError_utils_1.default("Product not found", 404);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product fetched successfully",
        data: product,
        statusCode: 200,
    });
});
//
// ========================== UPDATE PRODUCT ==========================
//
exports.updateProduct = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const product = await product_models_1.default.findById(id);
    if (!product)
        throw new appError_utils_1.default("Product not found", 404);
    const files = req.files;
    //! handle cover image update
    if (files?.cover_image?.[0]) {
        if (product.cover_image?.public_id) {
            await (0, cloudinary_utils_1.deleteFileFromCloudinary)(product.cover_image.public_id);
        }
        const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(files.cover_image[0], folder);
        body.cover_image = { path, public_id };
    }
    //! handle multiple images update
    if (files?.images?.length) {
        if (product.images?.length) {
            await Promise.all(product.images.map((product_logo) => (0, cloudinary_utils_1.deleteFileFromCloudinary)(product_logo.public_id)));
        }
        const uploaded = await Promise.all(files.images.map((file) => (0, cloudinary_utils_1.sendFileToCloudinary)(file, folder)));
        body.images = uploaded.map(({ path, public_id }) => ({ path, public_id }));
    }
    const updatedProduct = await product_models_1.default.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true,
    }).populate(["category", "brand"]);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product updated successfully",
        data: updatedProduct,
        statusCode: 200,
    });
});
//
// ========================== DELETE PRODUCT ==========================
//
exports.deleteProduct = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const product = await product_models_1.default.findById(id);
    if (!product)
        throw new appError_utils_1.default("Product not found", 404);
    //! delete cover image from cloudinary
    if (product.cover_image?.public_id) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(product.cover_image.public_id);
    }
    //! delete all extra images from cloudinary
    if (product.images?.length) {
        await Promise.all(product.images.map((img) => (0, cloudinary_utils_1.deleteFileFromCloudinary)(img.public_id)));
    }
    await product_models_1.default.findByIdAndDelete(id);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Product deleted successfully",
        data: null,
        statusCode: 200,
    });
});
//
// ========================== GET PRODUCTS BY CATEGORY ==========================
//
exports.getProductsByCategory = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { categoryId } = req.params;
    const existingCategory = await category_models_1.default.findById(categoryId);
    if (!existingCategory)
        throw new appError_utils_1.default("Category not found", 404);
    const products = await product_models_1.default.find({ category: categoryId })
        .populate("category")
        .populate("brand")
        .sort({ createdAt: -1 });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Products fetched successfully",
        data: products,
        statusCode: 200,
    });
});
//
// ========================== GET FEATURED PRODUCTS ==========================
//
exports.getFeaturedProducts = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_models_1.default.find({ featured: true })
        .populate("category")
        .populate("brand")
        .sort({ createdAt: -1 });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Featured products fetched successfully",
        data: products,
        statusCode: 200,
    });
});
//
// ========================== GET NEW ARRIVALS ==========================
//
exports.getNewArrivals = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const products = await product_models_1.default.find({ new_arrival: true })
        .populate("category")
        .populate("brand")
        .sort({ createdAt: -1 });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "New arrivals fetched successfully",
        data: products,
        statusCode: 200,
    });
});
