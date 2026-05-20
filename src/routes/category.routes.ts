import express from "express";

import {
  create,
  deleteCategory,
  getAll,
  getById,
  updateCategory,
} from "../controllers/category.controller";
import { multerUploader } from "../middlewares/multer.middlewares";

const router = express.Router();

//! get all category
router.get("/", getAll);

//! get category by id
router.get("/:id", getById);

//! create category
const upload= multerUploader()
router.post("/",upload.single("category_logo"),create);

//! update category
router.put("/:id", updateCategory);

//! delete category
router.delete("/:id", deleteCategory);

export default router;