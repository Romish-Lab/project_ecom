import express from "express";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../controllers/product.controller";

const router = express.Router();

//! get all products
router.get("/", getAllProducts);

//! get product by id
router.get("/:id", getProductById);

//! create product
router.post("/", createProduct);

//! delete product
router.delete("/:id", deleteProduct);

export default router;
