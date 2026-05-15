"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
//! register
const register = async (req, res, next) => {
    try {
        const { full_name, email, password, phone } = req.body;
        if (!full_name) {
            const error = new Error("full_name is required");
            error.statusCode = 400;
            error.status = "fail";
            throw error;
        }
        if (!email) {
            const error = new Error("email is required");
            error.statusCode = 400;
            error.status = "fail";
            throw error;
        }
        if (!password) {
            const error = new Error("password is required");
            error.statusCode = 400;
            error.status = "fail";
            throw error;
        }
        //* create User instance
        const user = new user_model_1.default({ full_name, email, password, phone });
        //! hanlde profile image
        //* save user
        await user.save();
        //* success response
        res.status(201).json({
            message: "Account created",
            data: user,
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
exports.register = register;
//! login
//! update profile
//! get profile
//! change password
