import nodemailer from "nodemailer";
import ENV_CONFIG from "./env.config";

const transporter = nodemailer.createTransport({
  host: ENV_CONFIG.smtp_host,
  port: Number(ENV_CONFIG.smtp_port),
  secure: Number(ENV_CONFIG.smtp_port) === 465,
  auth: {
    user: ENV_CONFIG.smtp_user,
    pass: ENV_CONFIG.smtp_pass,
  },
});

// ✅ verify connection on startup
transporter.verify((error) => {
  if (error) {
    console.error("❌ Email transporter error:", error.message);
  } else {
    console.log("✅ Email transporter is ready");
  }
});

export default transporter;
