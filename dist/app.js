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
const product_routes_1 = __importDefault(require("./routes/product.routes"));
const category_routes_1 = __importDefault(require("./routes/category.routes"));
const brand_routes_1 = __importDefault(require("./routes/brand.routes"));
const appError_utils_1 = __importDefault(require("./utils/appError.utils"));
//! creating express app instance
const app = (0, express_1.default)();
//! body parser
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true }));
//! home route
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Server is up and running",
        success: true,
        status: "success",
    });
});
//! using routes
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/products", product_routes_1.default);
app.use("/api/v1/categories", category_routes_1.default);
app.use("/api/v1/brands", brand_routes_1.default);
//! 404 route handler
app.use((req, res, next) => {
    // next({
    const message = "Route not found";
    throw new appError_utils_1.default(message, 404);
    //   // status: "fail",
    //   // success: false,
    //   // data: null,
    //   // statusCode: 404,
    // });
});
//! global error handler
app.use(errorHandler_middleware_1.errorHandler);
exports.default = app;
