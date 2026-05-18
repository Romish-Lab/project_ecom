import express from "express";

import {
  createBrand,
  deleteBrand,
  getAll,
  getById,
  updateBrand,
} from "../controllers/brand.controller"

const router = express.Router();

//! get all brands
router.get("/", getAll);

//! get brand by id
router.get("/:id", getById);

//! create brand
router.post("/", createBrand);

//! update brand
router.put("/:id", updateBrand);

//! delete brand
router.delete("/:id", deleteBrand);

export default router;