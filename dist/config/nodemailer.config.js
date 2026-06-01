"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const env_config_1 = __importDefault(require("./env.config"));
const transporter = nodemailer_1.default.createTransport({
    host: env_config_1.default.smtp_host,
    port: Number(env_config_1.default.smtp_port),
    secure: Number(env_config_1.default.smtp_port) === 465,
    auth: {
        user: env_config_1.default.smtp_user,
        pass: env_config_1.default.smtp_pass,
    },
});
// ✅ verify connection on startup
transporter.verify((error) => {
    if (error) {
        console.error("❌ Email transporter error:", error.message);
    }
    else {
        console.log("✅ Email transporter is ready");
    }
});
exports.default = transporter;
