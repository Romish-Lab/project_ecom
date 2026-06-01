import express from "express";
import {
  getAll,
  getById,
  create,
  update, 
  remove,
} from "../controllers/category.controller";
import { multerUploader } from "../middlewares/multer.middlewares";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

//! multer upload
const upload = multerUploader();

//! admin roles
const adminAuth = authenticate(["ADMIN", "SUPER_ADMIN"]);

//! get all categories
router.get("/", getAll);

//! get category by id
router.get("/:id", getById);

//! create category
router.post("/", adminAuth, upload.single("category_logo"), create);

//! update category
router.put("/:id", adminAuth, upload.single("category_logo"), update);

//! delete category
router.delete("/:id", adminAuth, remove);

export default router;
