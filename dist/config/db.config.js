"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const connectDatabase = async (DB_URI) => {
    try {
        if (!DB_URI) {
            throw new Error("DB_URI is undefined");
        }
        await mongoose_1.default.connect(DB_URI);
        console.log("Database connected");
    }
    catch (error) {
        console.log("----------Database connection error---------");
        console.log(error);
        process.exit(1);
    }
};
exports.default = connectDatabase;
