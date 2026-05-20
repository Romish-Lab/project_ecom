import express from "express";

import { register, login } from "../controllers/auth.controller";

// import multer from "multer";
// import path from "node:path";
// import fs from"fs";
import { multerUploader } from "../middlewares/multer.middlewares";


const router = express.Router();

//! register
//* upload folder
 const upload = multerUploader();
router.post("/register",upload.single("profile_image"),register);

//! login
router.post("/login", login);

export default router;
