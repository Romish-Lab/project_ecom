import { NextFunction, Request, Response } from "express";
import AppError from "../utils/appError.utils";
import { verifyToken } from "../utils/jwt.utils";
import ENV_CONFIG from "../config/env.config";
type Role = "ADMIN" | "USER" | "SUPER_ADMIN";

export const authenticate = (roles?: Role[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      //! get token from req cookie
      const cookies = req.cookies || {};
      const access_token = cookies["access_token"];
      console.log(access_token);

      if (!access_token) {
        throw new AppError("Unauthorized. Access denied", 401);
      }

      //! verify
      const decoded_data = verifyToken(access_token);

      if (!decoded_data) {
        throw new AppError("Unauthorized. Access denied", 401);
      }

      //! check token expired or not
      if (Date.now() > decoded_data.exp * 1000) {
        res.clearCookie("access_token", {
          httpOnly: ENV_CONFIG.node_env === "development" ? false : true,
          maxAge: Date.now(),
          secure: ENV_CONFIG.node_env === "development" ? false : true,
          sameSite: ENV_CONFIG.node_env === "development" ? "lax" : "none",
        });

        throw new AppError("Token expired. Access denied", 401);
      }

      (req as any).user = decoded_data;

      if (roles && !roles.includes(decoded_data.role)) {
        throw new AppError("Forbidden. Access denied", 403);
      }
      //! add logged in user data to req object
      req.user = {
        _id: decoded_data._id,
        full_name: decoded_data.full_name,
        email: decoded_data.email,
        role: decoded_data.role,
      };

      next();
    } catch (error) {
      next(error);
    }
  };
};
