import express from "express";

import {
  register,
  login,
  deleteUser,
  update,
  getProfile,
  changePassword,
} from "../controllers/auth.controller";

import { multerUploader } from "../middlewares/multer.middlewares";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

//! multer instance
const upload = multerUploader();

//! register
router.post("/register", upload.single("profile_image"), register);

//! login
router.post("/login", login);

//! delete user
router.delete("/delete", authenticate(["ADMIN", "SUPER_ADMIN"]), deleteUser);

//! update user
router.put(
  "/update",
  authenticate(["ADMIN", "SUPER_ADMIN"]),
  upload.single("profile_image"),
  update,
);

//! get profile
router.get(
  "/profile",
  authenticate(["USER", "ADMIN", "SUPER_ADMIN"]),
  getProfile,
);

//! change password
router.post(
  "/change-password",
  authenticate(["USER", "ADMIN", "SUPER_ADMIN"]),
  changePassword,
);

export default router;
