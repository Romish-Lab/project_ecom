import express from "express";

import {
  createProduct,
  deleteProduct,
  getAllProducts,
  getProductById,
} from "../controllers/product.controller";
import { authenticate } from "../middlewares/auth.middleware";
import { multerUploader } from "../middlewares/multer.middlewares";
const router = express.Router();

//! get all products
router.get("/", getAllProducts);

//! get product by id
router.get("/:id", getProductById);

//! create product
router.post("/", createProduct);

//! delete product
router.delete("/:id", deleteProduct);

//! create product
const upload = multerUploader();

router.post(
  "/",
  authenticate(["ADMIN", "SUPER_ADMIN"]), //  auth added
  upload.fields([
    { name: "cover_image", maxCount: 1 }, //  single cover
    { name: "images", maxCount: 5 }, // up to 5 extra images
  ]),
  createProduct,
);
export default router;
