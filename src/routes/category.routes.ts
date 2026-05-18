import express from "express";

import {
  create,
  deleteCategory,
  getAll,
  getById,
  updateCategory,
} from "../controllers/category.controller";

const router = express.Router();

//! get all category
router.get("/", getAll);

//! get category by id
router.get("/:id", getById);

//! create category
router.post("/", create);

//! update category
router.put("/:id", updateCategory);

//! delete category
router.delete("/:id", deleteCategory);

export default router;