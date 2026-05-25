"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
require("cookie-parser");
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const env_config_1 = __importDefault(require("../config/env.config"));
const authenticate = () => {
    return async (req, res, next) => {
        try {
            const access_token = req.cookies?.["access_token"];
            if (!access_token) {
                throw new appError_utils_1.default("Unauthorized. Access denied", 401);
            }
            const decoded_data = jsonwebtoken_1.default.verify(access_token, env_config_1.default.jwt_secret);
            if (!decoded_data || typeof decoded_data === "string") {
                throw new appError_utils_1.default("Invalid token", 401);
            }
            if (decoded_data.exp && Date.now() > decoded_data.exp * 1000) {
                res.clearCookie("access_token", {
                    httpOnly: true,
                    secure: env_config_1.default.node_env === "production",
                    sameSite: "strict",
                });
                throw new appError_utils_1.default("Session expired. Please login again", 401);
            }
            req.user = decoded_data;
            next();
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                res.clearCookie("access_token", {
                    httpOnly: true,
                    secure: env_config_1.default.node_env === "production",
                    sameSite: "strict",
                });
                return next(new appError_utils_1.default("Session expired. Please login again", 401));
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                return next(new appError_utils_1.default("Invalid token", 401));
            }
            return next(error);
        }
    };
};
exports.authenticate = authenticate;
