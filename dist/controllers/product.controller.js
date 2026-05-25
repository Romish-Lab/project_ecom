"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteProduct = exports.createProduct = exports.getProductById = exports.getAllProducts = void 0;
const product_models_1 = __importDefault(require("../models/product.models"));
//! get all products
const getAllProducts = async (req, res, next) => {
    try {
        const filter = {};
        //* get all products query
        const products = await product_models_1.default.find(filter);
        //* success response
        res.status(200).json({
            message: "All products fetched",
            data: products,
            success: true,
            status: "success",
        });
    }
    catch (error) {
        next({
            message: error?.message || "Something went wrong",
            status: "error",
            success: false,
            data: null,
            statusCode: error?.statusCode || 500,
        });
    }
};
exports.getAllProducts = getAllProducts;
//! get product by id
const getProductById = async (req, res, next) => {
    try {
        //* product id
        const { id } = req.params;
        //* db query
        const product = await product_models_1.default.findOne({ _id: id });
        //* product not found error
        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            error.status = "fail";
            throw error;
        }
        //* success response
        res.status(200).json({
            message: `Product ${id} fetched`,
            data: product,
            success: true,
            status: "success",
        });
    }
    catch (error) {
        next({
            message: error?.message || "Something went wrong",
            status: error?.status || "error",
            success: false,
            data: null,
            statusCode: error?.statusCode || 500,
        });
    }
};
exports.getProductById = getProductById;
//! create product
const createProduct = async (req, res, next) => {
    try {
        //* request body
        const body = req.body;
        //* create product
        const product = await product_models_1.default.create(body);
        //* success response
        res.status(201).json({
            message: "Product created successfully",
            data: product,
            success: true,
            status: "success",
        });
    }
    catch (error) {
        next({
            message: error?.message || "Something went wrong",
            status: "error",
            success: false,
            data: null,
            statusCode: error?.statusCode || 500,
        });
    }
};
exports.createProduct = createProduct;
//! delete product
const deleteProduct = async (req, res, next) => {
    try {
        //* product id
        const { id } = req.params;
        //* db query
        const product = await product_models_1.default.findByIdAndDelete(id);
        //* product not found error
        if (!product) {
            const error = new Error("Product not found");
            error.statusCode = 404;
            error.status = "fail";
            throw error;
        }
        //* success response
        res.status(200).json({
            message: `Product ${id} deleted`,
            data: product,
            success: true,
            status: "success",
        });
    }
    catch (error) {
        next({
            message: error?.message || "Something went wrong",
            status: error?.status || "error",
            success: false,
            data: null,
            statusCode: error?.statusCode || 500,
        });
    }
};
exports.deleteProduct = deleteProduct;
