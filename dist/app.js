"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
//! creating express app instances
const app = (0, express_1.default)();
//! body parser
app.use(express_1.default.json({ limit: "10mb" }));
//! using middlewares
//! exporting modules
exports.default = app;
