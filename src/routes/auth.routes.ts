import express from "express";

import {
  register,
  login,
  deleteUser,
  update,
  getProfile,
  changePassword,
  changeProfilePicture, //  was missing from imports
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
router.delete(
  "/delete/:id",
  authenticate(["ADMIN", "SUPER_ADMIN"]),
  deleteUser,
);

//! update user 
router.put(
  "/update/:id",
  authenticate(["ADMIN", "SUPER_ADMIN"]),
  upload.single("profile_image"),
  update,
);

//! get profile
router.get(
  "/profile/:id",
  authenticate(["USER", "ADMIN", "SUPER_ADMIN"]),
  getProfile,
);

//! change password 
router.post(
  "/change-password",
  authenticate(["USER", "ADMIN", "SUPER_ADMIN"]),
  changePassword,
);

//! change profile picture 
router.put(
  "/change-profile-picture",
  authenticate(["USER", "ADMIN", "SUPER_ADMIN"]),
  upload.single("profile_image"),
  changeProfilePicture,
);

export default router;
