import { NextFunction, Request, Response } from "express";
import User from "../models/user.model";
import AppError from "../utils/appError.utils";
import { sendResponse } from "../utils/sendResponse.utils";
import { catchAsync } from "../utils/catchAsync.utils";
import { hashPassword, comparePassword } from "../utils/bcrypt.utils";
import { generateJwtToken } from "../utils/jwt.utils";
import {
  deleteFileFromCloudinary,
  sendFileToCloudinary,
} from "../utils/claudinady.utils";
const folder = "/profile_picture";
import fs from "fs";
//! register
export const register = catchAsync(async (req: Request, res: Response) => {
  const { full_name, email, password, phone } = req.body;
  const image = req.file;
  // console.log(req.body)
  // const image=req.file
  // console.log(image)
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

  //! profile image
  if (image) {
    const { path, public_id } = await sendFileToCloudinary(
      image,
      "/profile_image",
    );
    user.profile_image = {
      path,
      public_id,
    };
  }

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
    const { id } = req.params;
    const body = req.body;
    const user = await User.findByIdAndUpdate(id, body, {
      new: true,
    });
    if (!user) {
      throw new AppError("User not found", 404);
    }
    //! success response
    sendResponse(res, {
      message: `user with id${id}updated successfully`,
      data: user,
      statusCode: 200,
    });
  },
);

//! get profile

export const getProfile = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await User.findById(id);
  if (!user) {
    throw new AppError("User not found", 400);
  }
  //! success response
  sendResponse(res, {
    message: `user with id${id}fetched successfully`,
    data: user,
    statusCode: 400,
  });
});

// //! change password
// export const changePassword = catchAsync(
//   async (req: Request, res: Response) => {
//     const { id } = req.params;
//     const user = await User.findById(id);
//   },
// );

//! change profile pic
export const changeProfilePicture = catchAsync(
  async (req: Request, res: Response) => {
    const image = req.file as Express.Multer.File;
    if (!image) {
      throw new AppError("Image is required", 400);
    }
    const { id } = req.params;
    //! find user
    const user = await User.findOne({ _id: id });
    if (!user) {
      throw new AppError("Use not found", 400);
    }

    if (user.profile_image?.public_id) {
      await deleteFileFromCloudinary(user.profile_image.public_id);
    }


    //! upload image to cloud
    const { path, public_id } = await sendFileToCloudinary(image, folder);

    //! assign new image
    user.profile_image = {
      path,
      public_id,
    };
    await user.save();

    //! send success response
    sendResponse(res, {
      message: "Profile picture updated successfuly",
      data: user,
      statusCode: 200,
    });
  },
);
