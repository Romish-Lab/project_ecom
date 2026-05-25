"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
// import multer from "multer";
// import path from "node:path";
// import fs from"fs";
const multer_middlewares_1 = require("../middlewares/multer.middlewares");
const router = express_1.default.Router();
//! register
//* upload folder
const upload = (0, multer_middlewares_1.multerUploader)();
router.post("/register", upload.single("profile_image"), auth_controller_1.register);
//! login
router.post("/login", auth_controller_1.login);
//! change profile image
router.post("/changeprofilepicture/:id", upload.single("profile_image"), auth_controller_1.changeProfilePicture);
exports.default = router;
