"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: [3, "Name must be 3 char. long"],
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
}, { timestamps: true });
//! model
const Product = mongoose_1.default.model("product", productSchema);
exports.default = Product;
