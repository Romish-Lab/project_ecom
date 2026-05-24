import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import AppError from "../utils/appError.utils";
import cookies from "cookie-parser";
export const authenticate=()={
    
    return async(req: Request, res: Response, next: NextFunction) => {

    }}