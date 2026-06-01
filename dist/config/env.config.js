"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requiredEnvVars = [
    "DB_URI",
    "JWT_SECRET",
    "JWT_EXPIRY",
    "COOKIE_EXPIRY",
    "CLOUDINARY_CLOUD_NAME",
    "CLOUDINARY_API_KEY",
    "CLOUDINARY_API_SECRET",
    "SMTP_SERVICE",
    "SMTP_USER",
    "SMTP_PASS",
    "SMTP_HOST",
    "SMTP_PORT",
];
//* Check all required vars at startup
for (const key of requiredEnvVars) {
    if (!process.env[key]) {
        throw new Error(`Missing required environment variable: ${key}`);
    }
}
const ENV_CONFIG = {
    node_env: process.env.NODE_ENV || "development",
    port: process.env.PORT || 8080,
    db_uri: process.env.DB_URI,
    jwt_secret: process.env.JWT_SECRET,
    jwt_expiry: process.env.JWT_EXPIRY || "7d",
    cookie_expiry: process.env.COOKIE_EXPIRY || "7d",
    cloudinary_cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    cloudinary_api_key: process.env.CLOUDINARY_API_KEY,
    cloudinary_api_secret: process.env.CLOUDINARY_API_SECRET,
    smtp_service: process.env.SMTP_SERVICE,
    smtp_user: process.env.SMTP_USER,
    smtp_pass: process.env.SMTP_PASS,
    smtp_host: process.env.SMTP_HOST,
    smtp_port: process.env.SMTP_PORT,
};
exports.default = ENV_CONFIG;
