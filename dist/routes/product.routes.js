"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const product_controller_1 = require("../controllers/product.controller");
const router = express_1.default.Router();
//! get all products
router.get("/", product_controller_1.getAllProducts);
//! get product by id
router.get("/:id", product_controller_1.getProductById);
//! create product
router.post("/", product_controller_1.createProduct);
//! delete product
router.delete("/:id", product_controller_1.deleteProduct);
exports.default = router;
