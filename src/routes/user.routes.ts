import express from "express";
import { deleteUser, getAll, getById } from "../controllers/user.controller";

const router = express.Router();

//! get all users
router.get("/", getAll);

//! get user by id
router.get("/:id", getById);

//! delete user
router.delete("/:id", deleteUser);

export default router;