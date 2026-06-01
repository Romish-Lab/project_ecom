"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const multer_middlewares_1 = require("../middlewares/multer.middlewares");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
//! multer upload666
const upload = (0, multer_middlewares_1.multerUploader)();
//! admin roles
const adminAuth = (0, auth_middleware_1.authenticate)(["ADMIN", "SUPER_ADMIN"]);
//! get all categories
router.get("/", category_controller_1.getAll);
//! get category by id
router.get("/:id", category_controller_1.getById);
//! create category
router.post("/", adminAuth, upload.single("category_logo"), category_controller_1.create);
//! update category
router.put("/:id", adminAuth, upload.single("category_logo"), category_controller_1.update);
//! delete category
router.delete("/:id", adminAuth, category_controller_1.remove);
exports.default = router;
