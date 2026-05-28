import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import ENV_CONFIG from "../config/env.config";

export type TPayload = {
  _id: mongoose.Types.ObjectId;
  full_name?: string;
  role: "ADMIN" | "USER" | "SUPER_ADMIN";
  email: string;
};
export type TJwtReturn={iat: number; exp: number} & TPayload

//! generate access token
export const generateJwtToken = (payload: TPayload) => {
  try {
    const access_token = jwt.sign(payload, ENV_CONFIG.jwt_secret, {
      expiresIn: ENV_CONFIG.jwt_expiry as any,
    });

    return access_token;
  } catch (error) {
    console.log(error);
    throw error;
  }
};

//! verify token
export const verifyToken = (token: string): TJwtReturn => {
  try {
    return jwt.verify(token, ENV_CONFIG.jwt_secret) as TJwtReturn;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
