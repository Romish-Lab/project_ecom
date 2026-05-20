import { NextFunction, Request, Response } from "express";

import User from "../models/user.model";

import AppError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catchAsync.utils";

import { hashPassword, comparePassword } from "../utils/bcrypt.utils";

import { generateJwtToken } from "../utils/jwt.utils";

//! register
export const register = catchAsync(async (req: Request, res: Response) => {
  const { full_name, email, password, phone } = req.body;
// console.log(req.body)
  if (!full_name) {
    throw new AppError("full name is required", 400);
  }

  if (!email) {
    throw new AppError("email is required", 400);
  }

  if (!password) {
    throw new AppError("password is required", 400);
  }

  //* check existing user
  const isUserExists = await User.findOne({ email });

  if (isUserExists) {
    throw new AppError("Email already exists", 400);
  }

  //* create User instance
  const user = new User({
    full_name,
    email,
    password,
    phone,
  });

  //! hash password
  const hash = await hashPassword(password);

  user.password = hash;

  //* save user
  await user.save();

  //* success response
  sendResponse(res, {
    message: "Account created",
    data: user,
    statusCode: 201,
  });
});

//! login
export const login = catchAsync(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email) {
    throw new AppError("email is required", 400);
  }

  if (!password) {
    throw new AppError("password is required", 400);
  }

  //* check user
  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Email or password doesn't match", 400);
  }

  //* compare password
  const isPasswordMatched = await comparePassword(password, user.password);

  if (!isPasswordMatched) {
    throw new AppError("Email or password doesn't match", 400);
  }

  //* jwt payload
  const payload = {
    _id: user._id,
    full_name: user.full_name,
    email: user.email,
    role: user.Role,
  };

  //* generate access token
  const access_token = generateJwtToken(payload);

  //* success response
  sendResponse(res, {
    message: "Login Success",
    data: {
      user,
      access_token,
    },
    statusCode: 200,
  });
});

//! update profile
export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // todo
  },
);

//! get profile

//! change password
