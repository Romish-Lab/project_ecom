import express, { Request, Response, NextFunction } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";

//! importing routes
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";
import productRoutes from "./routes/product.routes";
import categoryRoutes from "./routes/category.routes";
import brandRoutes from "./routes/brand.routes";

//! creating express app instance
const app = express();

//! body parser
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

//! home route
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    message: "Server is up and running",
    success: true,
    status: "success",
  });
});

//! using routes
app.use("/api/v1/auth", authRoutes);

app.use("/api/v1/users", userRoutes);

app.use("/api/v1/products", productRoutes);

app.use("/api/v1/categories", categoryRoutes);

app.use("/api/v1/brands", brandRoutes);

//! 404 route handler
app.use((req: Request, res: Response, next: NextFunction) => {
  next({
    message: "Route not found",
    status: "fail",
    success: false,
    data: null,
    statusCode: 404,
  });
});

//! global error handler
app.use(errorHandler);

export default app;