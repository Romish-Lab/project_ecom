"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ENV_CONFIG = {
    //* server
    node_env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 8080,
    //* database
    db_uri: process.env.DB_URI,
    //* jwt
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiry: process.env.JWT_EXPIRY || "7", // days
    //* cookie
    cookie_expiry: process.env.COOKIE_EXPIRY || "7", // days
    //* cloudinary
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
};
exports.default = ENV_CONFIG;
