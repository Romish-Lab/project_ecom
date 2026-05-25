"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const brandSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: [true, "Brand name is required"],
        trim: true,
    },
    description: {
        type: String,
        minlength: [5, "Description must be more than 5 characters"],
        trim: true,
    },
    brand_logo: {
        type: {
            path: {
                type: String
            },
            public_id: {
                type: String,
                required: true
            }
        }
    }
}, {
    timestamps: true,
});
const Brand = mongoose_1.default.model("Brand", brandSchema);
exports.default = Brand;
