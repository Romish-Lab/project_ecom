import { Request, Response } from "express";
import User from "../models/user.model";
import { catchAsync } from "../utils/catchAsync.utils";
import AppError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";

// crud user

//! get all users
export const getAll = catchAsync(
  async (req: Request, res: Response) => {
    const filter = {};

    //* get all users query
    const users = await User.find(filter);

    //* success response
    sendResponse(res, {
      message: "All users fetched",
      data: users,
      statusCode: 200,
    });
  },
);

//! get by id
export const getById = catchAsync(
  async (req: Request, res: Response) => {
    //* user id
    const { id } = req.params;

    //* db query
    const user = await User.findOne({ _id: id });

    //* user not found error
    if (!user) {
      throw new AppError("User not found", 404);
    }

    //* success response
    sendResponse(res, {
      message: `User ${id} fetched`,
      data: user,
      statusCode: 200,
    });
  },
);

//! create user
export const createUser = catchAsync(
  async (req: Request, res: Response) => {
    //* request body
    const body = req.body;

    //* create user in db
    const user = await User.create(body);

    //* success response
    sendResponse(res, {
      message: "User created successfully",
      data: user,
      statusCode: 201,
    });
  },
);

//! delete user
export const deleteUser = catchAsync(
  async (req: Request, res: Response) => {
    //* user id
    const { id } = req.params;

    //* db query
    const user = await User.findByIdAndDelete(id);

    //* user not found error
    if (!user) {
      throw new AppError("User not found", 404);
    }

    //* success response
    sendResponse(res, {
      message: `User ${id} deleted`,
      data: user,
      statusCode: 200,
    });
  },
);

//! update user
export const updateUser = catchAsync(
  async (req: Request, res: Response) => {
    //* user id
    const { id } = req.params;

    //* request body
    const body = req.body;

    //* update user
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
    });

    //* user not found error
    if (!user) {
      throw new AppError("User not found", 404);
    }

    //* success response
    sendResponse(res, {
      message: `User ${id} updated successfully`,
      data: user,
      statusCode: 200,
    });
  },
);