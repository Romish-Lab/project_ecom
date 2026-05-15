"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const errorHandler_middleware_1 = require("./middlewares/errorHandler.middleware");
//! importing routes
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
//! creating express app instance
const app = (0, express_1.default)();
//! body parser
app.use(express_1.default.json({ limit: "10mb" }));
//! using middlewares
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up and running",
        success: true,
        staus: "success",
    });
});
//! using routes
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/users", user_routes_1.default);
//! error handler
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
