import express, { Request, Response, NextFunction } from "express";
import { errorHandler } from "./middlewares/errorHandler.middleware";

//! importing routes
import userRoutes from "./routes/user.routes";
import authRoutes from "./routes/auth.routes";

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
