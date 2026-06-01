"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeProfilePicture = exports.deleteUser = exports.changePassword = exports.getProfile = exports.update = exports.login = exports.register = exports.Role = void 0;
const user_model_1 = __importDefault(require("../models/user.model"));
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const sendResponse_utils_1 = require("../utils/sendResponse.utils");
const catchAsync_utils_1 = require("../utils/catchAsync.utils");
const bcrypt_utils_1 = require("../utils/bcrypt.utils");
const jwt_utils_1 = require("../utils/jwt.utils");
const cloudinary_utils_1 = require("../utils/cloudinary.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const sendEmail_utils_1 = require("../utils/sendEmail.utils");
const folder = "/profile_image";
// ✅ Moved enum outside and exported so it can be reused across files
var Role;
(function (Role) {
    Role["ADMIN"] = "ADMIN";
    Role["USER"] = "USER";
    Role["SUPER_ADMIN"] = "SUPER_ADMIN";
})(Role || (exports.Role = Role = {}));
//
// ========================== REGISTER ==========================
//
exports.register = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    // ✅ Destructure role from req.body
    const { full_name, email, password, phone, role } = req.body;
    const image = req.file;
    if (!full_name)
        throw new appError_utils_1.default("Full name is required", 400);
    if (!email)
        throw new appError_utils_1.default("Email is required", 400);
    if (!password)
        throw new appError_utils_1.default("Password is required", 400);
    const existingUser = await user_model_1.default.findOne({ email });
    if (existingUser)
        throw new appError_utils_1.default("Email already exists", 400);
    const hashedPassword = await (0, bcrypt_utils_1.hashPassword)(password);
    const user = new user_model_1.default({
        full_name,
        email,
        password: hashedPassword,
        phone,
        profile_image: { path: "", public_id: "" },
        // ✅ Fixed: was "user: Role.USER", now correctly assigns role field
        // ✅ Also validates that passed role is a valid enum value, else defaults to USER
        Role: role && Object.values(Role).includes(role)
            ? role
            : Role.USER,
    });
    if (image) {
        const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
        user.profile_image = { path, public_id };
    }
    await user.save();
    await (0, sendEmail_utils_1.sendEmail)({
        to: user.email,
        subject: "Welcome to Project Ecommerce!",
        userName: user.full_name,
        message: "Your account has been created successfully.",
    });
    // ✅ Fixed: was "user.Role" which is correct for this model, kept consistent
    const payload = {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.Role,
    };
    const access_token = (0, jwt_utils_1.generateJwtToken)(payload);
    res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: env_config_1.default.node_env === "production",
        sameSite: "strict",
        maxAge: parseInt(env_config_1.default.cookie_expiry) * 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Account created successfully",
        data: { user, access_token },
        statusCode: 201,
    });
});
//
// ========================== LOGIN ==========================
//
exports.login = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { email, password } = req.body;
    if (!email)
        throw new appError_utils_1.default("Email is required", 400);
    if (!password)
        throw new appError_utils_1.default("Password is required", 400);
    const user = await user_model_1.default.findOne({ email });
    if (!user)
        throw new appError_utils_1.default("Invalid credentials", 400);
    const isMatch = await (0, bcrypt_utils_1.comparePassword)(password, user.password);
    if (!isMatch)
        throw new appError_utils_1.default("Invalid credentials", 400);
    // ✅ Fixed: consistent role field in payload
    const payload = {
        _id: user._id,
        full_name: user.full_name,
        email: user.email,
        role: user.Role,
    };
    const access_token = (0, jwt_utils_1.generateJwtToken)(payload);
    res.cookie("access_token", access_token, {
        httpOnly: true,
        secure: env_config_1.default.node_env === "production",
        sameSite: "strict",
        maxAge: parseInt(env_config_1.default.cookie_expiry) * 24 * 60 * 60 * 1000,
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Login successful",
        data: { user, access_token },
        statusCode: 200,
    });
});
//
// ========================== UPDATE USER ==========================
//
exports.update = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const body = req.body;
    const image = req.file;
    const user = await user_model_1.default.findById(id);
    if (!user)
        throw new appError_utils_1.default("User not found", 404);
    if (image) {
        // ✅ Fixed: removed redundant reset to empty strings before uploading
        if (user.profile_image?.public_id) {
            await (0, cloudinary_utils_1.deleteFileFromCloudinary)(user.profile_image.public_id);
        }
        const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
        body.profile_image = { path, public_id };
    }
    const updatedUser = await user_model_1.default.findByIdAndUpdate(id, body, { new: true });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "User updated successfully",
        data: updatedUser,
        statusCode: 200,
    });
});
//
// ========================== GET PROFILE ==========================
//
exports.getProfile = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const user = await user_model_1.default.findById(id);
    if (!user)
        throw new appError_utils_1.default("User not found", 404);
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "User fetched successfully",
        data: user,
        statusCode: 200,
    });
});
//
// ========================== CHANGE PASSWORD ==========================
//
exports.changePassword = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    //  Fixed: get id from req.user instead of req.params (authenticated route)
    const id = req.user?._id;
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
        throw new appError_utils_1.default("All fields are required", 400);
    }
    const user = await user_model_1.default.findById(id);
    if (!user)
        throw new appError_utils_1.default("User not found", 404);
    const isMatch = await (0, bcrypt_utils_1.comparePassword)(currentPassword, user.password);
    if (!isMatch)
        throw new appError_utils_1.default("Current password is incorrect", 400);
    // ✅ Added: prevent setting same password as current
    const isSame = await (0, bcrypt_utils_1.comparePassword)(newPassword, user.password);
    if (isSame)
        throw new appError_utils_1.default("New password cannot be same as current password", 400);
    user.password = await (0, bcrypt_utils_1.hashPassword)(newPassword);
    await user.save();
    await (0, sendEmail_utils_1.sendEmail)({
        to: user.email,
        subject: "Your password has been changed",
        userName: user.full_name,
        message: "Your password has been updated successfully.",
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Password updated successfully",
        data: null,
        statusCode: 200,
    });
});
//
// ========================== DELETE USER ==========================
//
exports.deleteUser = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const { id } = req.params;
    const user = await user_model_1.default.findById(id);
    if (!user)
        throw new appError_utils_1.default("User not found", 404);
    if (user.profile_image?.public_id) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(user.profile_image.public_id);
    }
    await user_model_1.default.findByIdAndDelete(id);
    res.clearCookie("access_token");
    await (0, sendEmail_utils_1.sendEmail)({
        to: user.email,
        subject: "Your account has been deleted",
        userName: user.full_name,
        message: "Your account has been deleted successfully.",
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "User deleted successfully",
        data: null,
        statusCode: 200,
    });
});
//
// ========================== CHANGE PROFILE PICTURE ==========================
//
exports.changeProfilePicture = (0, catchAsync_utils_1.catchAsync)(async (req, res) => {
    const image = req.file;
    const id = req.user?._id;
    if (!image)
        throw new appError_utils_1.default("Profile image is required", 400);
    const user = await user_model_1.default.findById(id);
    if (!user)
        throw new appError_utils_1.default("User not found", 404);
    if (user.profile_image?.public_id) {
        await (0, cloudinary_utils_1.deleteFileFromCloudinary)(user.profile_image.public_id);
    }
    const { path, public_id } = await (0, cloudinary_utils_1.sendFileToCloudinary)(image, folder);
    user.profile_image = { path, public_id };
    await user.save();
    await (0, sendEmail_utils_1.sendEmail)({
        to: user.email,
        subject: "Your profile picture has been updated",
        userName: user.full_name,
        message: "Your profile picture has been updated successfully.",
    });
    (0, sendResponse_utils_1.sendResponse)(res, {
        message: "Profile picture updated successfully",
        data: user,
        statusCode: 200,
    });
});
