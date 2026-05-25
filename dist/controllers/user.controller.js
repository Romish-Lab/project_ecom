"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.createUser = exports.getById = exports.getAll = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
// crud user
//! get all users
exports.getAll = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const filter = {};
    //* get all users query
    const users = await user_model_1.default.find(filter);
    //* success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "All users fetched",
        data: users,
        statusCode: 200,
    });
});
//! get by id
exports.getById = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    //* user id
    const { id } = req.params;
    //* db query
    const user = await user_model_1.default.findOne({ _id: id });
    //* user not found error
    if (!user) {
        throw new appError_utils_1.default("User not found", 404);
    }
    //* success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `User ${id} fetched`,
        data: user,
        statusCode: 200,
    });
});
//! create user
exports.createUser = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    //* request body
    const body = req.body;
    //* create user in db
    const user = await user_model_1.default.create(body);
    //* success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "User created successfully",
        data: user,
        statusCode: 201,
    });
});
//! delete user
exports.deleteUser = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    //* user id
    const { id } = req.params;
    //* db query
    const user = await user_model_1.default.findByIdAndDelete(id);
    //* user not found error
    if (!user) {
        throw new appError_utils_1.default("User not found", 404);
    }
    //* success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `User ${id} deleted`,
        data: user,
        statusCode: 200,
    });
});
//! update user
exports.updateUser = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    //* user id
    const { id } = req.params;
    //* request body
    const body = req.body;
    //* update user
    const user = await user_model_1.default.findByIdAndUpdate(id, body, {
        new: true,
    });
    //* user not found error
    if (!user) {
        throw new appError_utils_1.default("User not found", 404);
    }
    //* success response
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: `User ${id} updated successfully`,
        data: user,
        statusCode: 200,
    });
});
