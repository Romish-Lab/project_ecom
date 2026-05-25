"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
//! hash password
const hashPassword = async (password) => {
    try {
        const salt = await bcryptjs_1.default.genSalt(10);
        const hashedPassword = await bcryptjs_1.default.hash(password, salt);
        return hashedPassword;
    }
    catch (error) {
        console.log("Error hashing password:", error);
        throw error;
    }
};
exports.hashPassword = hashPassword;
const comparePassword = async (plainPassword, hashedPassword) => {
    try {
        const isMatch = await bcryptjs_1.default.compare(plainPassword, hashedPassword);
        return isMatch;
    }
    catch (error) {
        console.log("Error comparing password:", error);
        throw error;
    }
};
exports.comparePassword = comparePassword;
