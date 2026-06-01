import express, { Request, Response, NextFunction } from "express";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middlewares/errorHandler.middleware";
import AppError from "./utils/appError.utils";

// routes
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import brandRoutes from "./routes/brand.routes";
import cartRoutes from "./routes/cart.routes";
const app = express();

app.set("trust proxy", 1);

// middlewares
app.use(cookieParser());
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// health check
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is up and running",
    success: true,
  });
});

// routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/products", productRoutes);
app.use("/api/v1/categories", categoryRoutes);
app.use("/api/v1/brands", brandRoutes);
app.use("/api/v1/cart", cartRoutes);

// 404 handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next(new AppError("Route not found", 404));
});

// global error handler
app.use(errorHandler);

export default app;
