"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const category_controller_1 = require("../controllers/category.controller");
const multer_middlewares_1 = require("../middlewares/multer.middlewares");
const router = express_1.default.Router();
//! get all category
router.get("/", category_controller_1.getAll);
//! get category by id
router.get("/:id", category_controller_1.getById);
//! create category
const upload = (0, multer_middlewares_1.multerUploader)();
router.post("/", upload.single("category_logo"), category_controller_1.create);
//! update category
router.put("/:id", category_controller_1.updateCategory);
//! delete category
router.delete("/:id", category_controller_1.deleteCategory);
exports.default = router;
