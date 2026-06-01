"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendEmail = void 0;
const env_config_1 = __importDefault(require("../config/env.config"));
const nodemailer_config_1 = __importDefault(require("../config/nodemailer.config"));
const sendEmail = async ({ to, subject, userName = "User", message = "Welcome to our ecommerce platform.", cc, bcc, attachments, }) => {
    try {
        const html = `
  <div style="background:#e8e4dc; padding:40px 20px; font-family:Georgia,serif;">
    <div style="max-width:620px; margin:auto; background:#faf8f4; border-radius:4px; overflow:hidden;">

      <!-- Header -->
      <div style="background:#0c0c0c; padding:36px 48px 32px;">
        <div style="display:flex; align-items:center; gap:10px; margin-bottom:28px;">
          <div style="width:8px; height:8px; background:#c9a96e; border-radius:50%;"></div>
          <span style="font-size:11px; letter-spacing:0.18em; color:#888; text-transform:uppercase; font-family:Georgia,serif;">Project Ecommerce</span>
        </div>
        <h1 style="margin:0 0 6px; font-size:38px; font-weight:400; color:#f5f0e8; letter-spacing:-0.01em; line-height:1.1; font-family:Georgia,serif;">Welcome</h1>
        <p style="margin:0; font-size:13px; color:#666; letter-spacing:0.06em; text-transform:uppercase;">Account confirmed</p>
      </div>

      <!-- Gold bar -->
      <div style="height:3px; background:linear-gradient(90deg,#c9a96e 0%,#e8cc8a 50%,#c9a96e 100%);"></div>

      <!-- Body -->
      <div style="padding:44px 48px 36px;">
        <p style="margin:0 0 8px; font-size:13px; color:#999; letter-spacing:0.1em; text-transform:uppercase;">Hello</p>
        <p style="margin:0 0 28px; font-size:28px; color:#1a1a1a; font-weight:400; font-family:Georgia,serif;">${userName}</p>
        <div style="width:40px; height:2px; background:#c9a96e; margin:0 0 28px;"></div>

        <p style="font-size:15px; color:#4a4a4a; line-height:1.8; margin:0 0 16px;">${message}</p>
        <p style="font-size:15px; color:#4a4a4a; line-height:1.8; margin:0 0 36px;">
          Thank you for choosing <strong style="color:#1a1a1a;">Project Ecommerce</strong> — we're glad you're here.
        </p>

        <!-- Button -->
        <div style="margin:0 0 40px;">
          <a href="http://localhost:3000"
            style="display:inline-block; background:#0c0c0c; color:#f5f0e8; text-decoration:none; font-size:12px; letter-spacing:0.14em; text-transform:uppercase; padding:14px 32px; font-family:Georgia,serif;">
            Visit Store
          </a>
        </div>

        <p style="font-size:12px; color:#aaa; line-height:1.7; border-top:1px solid #e8e4da; padding-top:24px; margin:0;">
          If you did not create this account, you can safely ignore this email. No action is required.
        </p>
      </div>

      <!-- Footer -->
      <div style="background:#0c0c0c; padding:24px 48px; display:flex; align-items:center; justify-content:space-between;">
        <span style="font-size:12px; letter-spacing:0.12em; color:#555; text-transform:uppercase; font-family:Georgia,serif;">Project Ecommerce</span>
        <span style="font-size:11px; color:#444; letter-spacing:0.04em;">© ${new Date().getFullYear()} · All rights reserved.</span>
      </div>

    </div>
  </div>
`;
        const mailOptions = {
            to,
            from: `Project Ecommerce <${env_config_1.default.smtp_user}>`,
            subject,
            html,
        };
        if (cc)
            mailOptions.cc = cc;
        if (bcc)
            mailOptions.bcc = bcc;
        if (attachments)
            mailOptions.attachments = attachments;
        await nodemailer_config_1.default.sendMail(mailOptions);
        return true;
    }
    catch (error) {
        console.log("Email Error:", error);
        throw error;
    }
};
exports.sendEmail = sendEmail;
