import express from "express";

import {
  register,
  login,
  changeProfilePicture,
} from "../controllers/auth.controller";

import { multerUploader } from "../middlewares/multer.middlewares";
import { authenticate } from "../middlewares/auth.middleware";

const router = express.Router();

//! upload
const upload = multerUploader();

//! register
router.post("/register", upload.single("profile_image"), register);

//! login
router.post("/login", login);

//! change profile image
router.post(
  "/changeprofilepicture/:id",
  upload.single("profile_image"),
  authenticate(["USER", "ADMIN"]),
  changeProfilePicture,
);

export default router;
