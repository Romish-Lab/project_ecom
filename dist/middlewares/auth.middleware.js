"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authenticate = void 0;
const appError_utils_1 = __importDefault(require("../utils/appError.utils"));
const jwt_utils_1 = require("../utils/jwt.utils");
const env_config_1 = __importDefault(require("../config/env.config"));
const authenticate = (roles) => {
    return async (req, res, next) => {
        try {
            //! get token from req cookie
            const cookies = req.cookies || {};
            const access_token = cookies["access_token"];
            console.log(access_token);
            if (!access_token) {
                throw new appError_utils_1.default("Unauthorized. Access denied", 401);
            }
            //! verify
            const decoded_data = (0, jwt_utils_1.verifyToken)(access_token);
            if (!decoded_data) {
                throw new appError_utils_1.default("Unauthorized. Access denied", 401);
            }
            //! check token expired or not
            if (Date.now() > decoded_data.exp * 1000) {
                res.clearCookie("access_token", {
                    httpOnly: env_config_1.default.node_env === "development" ? false : true,
                    maxAge: Date.now(),
                    secure: env_config_1.default.node_env === "development" ? false : true,
                    sameSite: env_config_1.default.node_env === "development" ? "lax" : "none",
                });
                throw new appError_utils_1.default("Token expired. Access denied", 401);
            }
            req.user = decoded_data;
            if (roles && !roles.includes(decoded_data.role)) {
                throw new appError_utils_1.default("Forbidden. Access denied", 403);
            }
            //! add logged in user data to req object
            req.user = {
                _id: decoded_data._id,
                full_name: decoded_data.full_name,
                email: decoded_data.email,
                role: decoded_data.role,
            };
            next();
        }
        catch (error) {
            next(error);
        }
    };
};
exports.authenticate = authenticate;
