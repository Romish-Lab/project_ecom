import { Request, Response, NextFunction } from "express";
import User from "../models/user.model";

import AppError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catchAsync.utils";

import { hashPassword, comparePassword } from "../utils/bcrypt.utils";

import { generateJwtToken } from "../utils/jwt.utils";

import {
  sendFileToCloudinary,
  deleteFileFromCloudinary,
} from "../utils/claudinady.utils";

import ENV_CONFIG from "../config/env.config";

const folder = "/profile_image";

//
// ========================== REGISTER ==========================
//
export const register = catchAsync(async (req: Request, res: Response) => {
  const { full_name, email, password, phone } = req.body;

  const image = req.file as Express.Multer.File;

  if (!full_name) throw new AppError("Full name is required", 400);
  if (!email) throw new AppError("Email is required", 400);
  if (!password) throw new AppError("Password is required", 400);

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Email already exists", 400);
  }

  const hashedPassword = await hashPassword(password);

  const user = new User({
    full_name,
    email,
    password: hashedPassword,
    phone,
  });

  if (image) {
    const { path, public_id } = await sendFileToCloudinary(image, folder);

    user.profile_image = { path, public_id };
  }

  await user.save();

  const payload = {
    _id: user._id,
    full_name: user.full_name,
    email: user.email,
    role: user.Role,
  };

  const access_token = generateJwtToken(payload);

  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: ENV_CONFIG.node_env === "production",
    sameSite: "strict",
    maxAge: parseInt(ENV_CONFIG.cookie_expiry) * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    message: "Account created successfully",
    data: { user, access_token },
    statusCode: 201,
  });
});

//
// ========================== LOGIN ==========================
//
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) throw new AppError("Email is required", 400);
  if (!password) throw new AppError("Password is required", 400);

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Invalid credentials", 400);
  }

  const isMatch = await comparePassword(password, user.password);

  if (!isMatch) {
    throw new AppError("Invalid credentials", 400);
  }

  const payload = {
    _id: user._id,
    full_name: user.full_name,
    email: user.email,
    role: user.Role,
  };

  const access_token = generateJwtToken(payload);

  res.cookie("access_token", access_token, {
    httpOnly: true,
    secure: ENV_CONFIG.node_env === "production",
    sameSite: "strict",
    maxAge: parseInt(ENV_CONFIG.cookie_expiry) * 24 * 60 * 60 * 1000,
  });

  sendResponse(res, {
    message: "Login successful",
    data: { user, access_token },
    statusCode: 200,
  });
});


// ========================== UPDATE USER ==========================
//
export const update = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const body = req.body;
  const image = req.file as Express.Multer.File;

  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (image) {
    if (user.profile_image?.public_id) {
      await deleteFileFromCloudinary(user.profile_image.public_id);
    }

    const { path, public_id } = await sendFileToCloudinary(image, folder);

    body.profile_image = { path, public_id };
  }

  const updatedUser = await User.findByIdAndUpdate(id, body, {
    new: true,
  });

  sendResponse(res, {
    message: `User updated successfully`,
    data: updatedUser,
    statusCode: 200,
  });
});

//
// ========================== GET PROFILE ==========================
//
export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  sendResponse(res, {
    message: "User fetched successfully",
    data: user,
    statusCode: 200,
  });
});

//
// ========================== CHANGE PASSWORD ==========================
//
export const changePassword = catchAsync(
  async (req: Request, res: Response) => {
    const { id } = req.params;
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      throw new AppError("All fields are required", 400);
    }

    const user = await User.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    const isMatch = await comparePassword(currentPassword, user.password);

    if (!isMatch) {
      throw new AppError("Current password is incorrect", 400);
    }

    user.password = await hashPassword(newPassword);

    await user.save();

    sendResponse(res, {
      message: "Password updated successfully",
      data: null,
      statusCode: 200,
    });
  },
);

//
// ========================== DELETE USER ==========================
//
export const deleteUser = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.profile_image?.public_id) {
    await deleteFileFromCloudinary(user.profile_image.public_id);
  }

  await User.findByIdAndDelete(id);

  res.clearCookie("access_token");

  sendResponse(res, {
    message: "User deleted successfully",
    data: null,
    statusCode: 200,
  });
});
export const changeProfilePicture = catchAsync(
  async (req: Request, res: Response) => {
    const image = req.file as Express.Multer.File;
   const id=req.user?._id

    const user = await User.findById(id);

    if (!user) {
      throw new AppError("User not found", 404);
    }

    if (user.profile_image?.public_id) {
      await deleteFileFromCloudinary(user.profile_image.public_id);
    }

    const { path, public_id } = await sendFileToCloudinary(
      image,
      "/profile_image",
    );

    user.profile_image = { path, public_id };

    await user.save();

    sendResponse(res, {
      message: "Profile picture updated successfully",
      data: user,
      statusCode: 200,
    });
  },
);
