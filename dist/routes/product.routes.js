"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const multer_middlewares_1 = require("../middlewares/multer.middlewares");
const router = express_1.default.Router();
//! get all products
router.get("/", product_controller_1.getAllProducts);
//! get product by id
router.get("/:id", product_controller_1.getProductById);
//! create product
router.post("/", product_controller_1.createProduct);
//! delete product
router.delete("/:id", product_controller_1.deleteProduct);
//! create product
const upload = (0, multer_middlewares_1.multerUploader)();
router.post("/", (0, auth_middleware_1.authenticate)(["ADMIN", "SUPER_ADMIN"]), //  auth added
upload.fields([
    { name: "cover_image", maxCount: 1 }, //  single cover
    { name: "images", maxCount: 5 }, // up to 5 extra images
]), product_controller_1.createProduct);
exports.default = router;
