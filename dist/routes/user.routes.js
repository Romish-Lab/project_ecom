"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_controller_1 = require("../controllers/user.controller");
const router = express_1.default.Router();
//! get all users
router.get("/", user_controller_1.getAll);
//! get user by id
router.get("/:id", user_controller_1.getById);
//! create user
router.post("/", user_controller_1.createUser);
//! delete user
router.delete("/:id", user_controller_1.deleteUser);
exports.default = router;
