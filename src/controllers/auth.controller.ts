import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import AppError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catchAsync.utils";

//! register
export const register = catchAsync(async (req: Request, res: Response) => {
  const { full_name, email, password, phone } = req.body;

  if (!full_name) {
    throw new AppError("full name is required", 400);
  }

  if (!email) {
    throw new AppError("email is required", 400);
  }

  if (!password) {
    throw new AppError("password is required", 400);
  }

  //* create User instance
  const user = new User({ full_name, email, password, phone });

  //! handle profile image

  //* save user
  await user.save();

  //* success response
  // res.status(201).json({
  // message: "Account created",
  // data: user,
  // success: true,
  // status: "success",
  // });

  sendResponse(res, {
    message: "Account created",
    data: user,
    statusCode: 201,
  });
});

//! login
export const login = catchAsync(async (req: Request, res: Response) => {
  //* login

  const { email, password } = req.body;

  if (!email) {
    throw new AppError("email is required", 400);
  }

  if (!password) {
    throw new AppError("password is required", 400);
  }

  const user = await User.findOne({ email: email });

  if (!user) {
    throw new AppError("Email or password doesn't match", 400);
  }

  const isPasswordMatched = password === user.password;

  if (!isPasswordMatched) {
    throw new AppError("Email or password doesn't match", 400);
  }

  //todo: generate access token

  // //* success response
  // res.status(201).json({
  // message:"Login Success",
  // data: user,
  // status:"success",
  // })

  sendResponse(res, {
    message: "Login Success",
    data: user,
    statusCode: 201,
  });
});

//! update profile
export const update = catchAsync(
  async (req: Request, res: Response, next: NextFunction) => {
    // try logic
  },
);

//! get profile

//! change password
