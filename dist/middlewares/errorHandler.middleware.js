"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const errorHandler = (error, req, res, next) => {
    const message = error?.message || "Internal server error";
    const statusCode = error?.statusCode || 500;
    const status = error?.status || "error";
    //* error response
    res.status(statusCode).json({
        message,
        status,
        success: false,
        data: null,
    });
};
exports.errorHandler = errorHandler;
