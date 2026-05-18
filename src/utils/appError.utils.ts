class AppError extends Error {
  statusCode: number;
  status: "error" | "success" | "fail";
  success: boolean;

  constructor(message: string, statusCode: number) {
    super(message);

    this.statusCode = statusCode;

    this.status = statusCode >= 400 ? "fail" : "success";

    this.success = false;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default AppError;