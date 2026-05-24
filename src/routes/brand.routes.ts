import express from "express";

import {
  createBrand,
  deleteBrand,
  getAll,
  getById,
  updateBrand,
} from "../controllers/brand.controller";

import { multerUploader } from "../middlewares/multer.middlewares";

const router = express.Router();

//! multer instance
const upload = multerUploader();

//! get all brands
router.get("/", getAll);

//! get brand by id
router.get("/:id", getById);

//! create brand
router.post("/", upload.single("brand_logo"), createBrand);

//! update brand
router.put("/:id", upload.single("brand_logo"), updateBrand);

//! delete brand
router.delete("/:id", deleteBrand);

export default router;
