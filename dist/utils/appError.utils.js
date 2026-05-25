"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class AppError extends Error {
    constructor(message, statusCode) {
        super(message);
        this.statusCode = statusCode;
        this.status = statusCode >= 400 ? "fail" : "success";
        this.success = false;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.default = AppError;
