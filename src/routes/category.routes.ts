import express from "express";

import {
  create,
  deleteCategory,
  getAll,
  getById,
  updateCategory,
} from "../controllers/category.controller";

import { multerUploader } from "../middlewares/multer.middlewares";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

//! roles
enum Role {
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
  USER = "USER",
}

//! get all category
router.get("/", getAll);

//! get category by id
router.get("/:id", getById);

//! multer upload
const upload = multerUploader();

//! create category
router.post(
  "/",
  upload.single("category_logo"),
  authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
  create,
);

//! update category 
router.put(
  "/:id",
  upload.single("category_logo"),
  authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
  updateCategory,
);

//! delete category
router.delete(
  "/:id",
  authenticate([Role.ADMIN, Role.SUPER_ADMIN]),
  deleteCategory,
);

export default router;
