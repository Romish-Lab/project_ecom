"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_controller_1 = require("../controllers/auth.controller");
const multer_middlewares_1 = require("../middlewares/multer.middlewares");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
//! multer instance
const upload = (0, multer_middlewares_1.multerUploader)();
//! register
router.post("/register", upload.single("profile_image"), auth_controller_1.register);
//! login
router.post("/login", auth_controller_1.login);
//! delete user 
router.delete("/delete/:id", (0, auth_middleware_1.authenticate)(["ADMIN", "SUPER_ADMIN"]), auth_controller_1.deleteUser);
//! update user 
router.put("/update/:id", (0, auth_middleware_1.authenticate)(["ADMIN", "SUPER_ADMIN"]), upload.single("profile_image"), auth_controller_1.update);
//! get profile
router.get("/profile/:id", (0, auth_middleware_1.authenticate)(["USER", "ADMIN", "SUPER_ADMIN"]), auth_controller_1.getProfile);
//! change password 
router.post("/change-password", (0, auth_middleware_1.authenticate)(["USER", "ADMIN", "SUPER_ADMIN"]), auth_controller_1.changePassword);
//! change profile picture 
router.put("/change-profile-picture", (0, auth_middleware_1.authenticate)(["USER", "ADMIN", "SUPER_ADMIN"]), upload.single("profile_image"), auth_controller_1.changeProfilePicture);
exports.default = router;
