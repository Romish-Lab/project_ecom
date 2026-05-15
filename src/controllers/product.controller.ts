import { NextFunction, Request, Response } from "express";
import Product from "../models/product.models";

//! get all products
export const getAllProducts = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const filter = {};

    //* get all products query
    const products = await Product.find(filter);

    //* success response
    res.status(200).json({
      message: "All products fetched",
      data: products,
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      status: "error",
      success: false,
      data: null,
      statusCode: error?.statusCode || 500,
    });
  }
};

//! get product by id
export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //* product id
    const { id } = req.params;

    //* db query
    const product = await Product.findOne({ _id: id });

    //* product not found error
    if (!product) {
      const error: any = new Error("Product not found");
      error.statusCode = 404;
      error.status = "fail";

      throw error;
    }

    //* success response
    res.status(200).json({
      message: `Product ${id} fetched`,
      data: product,
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      status: error?.status || "error",
      success: false,
      data: null,
      statusCode: error?.statusCode || 500,
    });
  }
};

//! create product
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //* request body
    const body = req.body;

    //* create product
    const product = await Product.create(body);

    //* success response
    res.status(201).json({
      message: "Product created successfully",
      data: product,
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      status: "error",
      success: false,
      data: null,
      statusCode: error?.statusCode || 500,
    });
  }
};

//! delete product
export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    //* product id
    const { id } = req.params;

    //* db query
    const product = await Product.findByIdAndDelete(id);

    //* product not found error
    if (!product) {
      const error: any = new Error("Product not found");
      error.statusCode = 404;
      error.status = "fail";

      throw error;
    }

    //* success response
    res.status(200).json({
      message: `Product ${id} deleted`,
      data: product,
      success: true,
      status: "success",
    });
  } catch (error: any) {
    next({
      message: error?.message || "Something went wrong",
      status: error?.status || "error",
      success: false,
      data: null,
      statusCode: error?.statusCode || 500,
    });
  }
};
