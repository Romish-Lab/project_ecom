"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const categorySchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "name is required"],
        minLength: [3, "name must be 3 char. long"],
        trim: true,
    },
    description: {
        type: String,
        minLength: [5, "Description must be 5 char long"],
        trim: true,
    },
    category_logo: {
        type: {
            path: {
                type: String,
            },
            public_id: {
                type: String,
                required: true,
            },
        },
    },
}, { timestamps: true });
const Category = mongoose_1.default.model("Category", categorySchema);
exports.default = Category;
