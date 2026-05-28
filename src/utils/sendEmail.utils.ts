import ENV_CONFIG from "../config/env.config";
import transporter from "../config/nodemailer.config";

type TEmailOptions = {
  to: string;
  subject: string;
  userName?: string;
  message?: string;
  cc?: string | string[];
  bcc?: string | string[];
  attachments?: any[];
};

export const sendEmail = async ({
  to,
  subject,
  userName = "User",
  message = "Welcome to our ecommerce platform.",
  cc,
  bcc,
  attachments,
}: TEmailOptions) => {
  try {
    const html = `
      <div style="font-family: Arial, sans-serif; background-color: #f4f4f4; padding: 40px 20px;">
        <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 2px 10px rgba(0,0,0,0.1);">
          
          <!-- Header -->
          <div style="background: #111827; padding: 20px; text-align: center;">
            <h1 style="color: #ffffff; margin: 0;">
              Project Ecommerce
            </h1>
          </div>

          <!-- Body -->
          <div style="padding: 30px;">
            <h2 style="color: #111827;">
              Hello, ${userName} 👋
            </h2>

            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              ${message}
            </p>

            <p style="color: #4b5563; font-size: 16px; line-height: 1.6;">
              Thank you for choosing 
              <strong>Project Ecommerce</strong>.
            </p>

            <!-- Button -->
            <div style="text-align: center; margin: 30px 0;">
              <a 
                href="http://localhost:3000"
                style="
                  background: #2563eb;
                  color: #ffffff;
                  padding: 14px 28px;
                  text-decoration: none;
                  border-radius: 6px;
                  font-size: 16px;
                  font-weight: bold;
                  display: inline-block;
                "
              >
                Visit Store
              </a>
            </div>

            <p style="color: #6b7280; font-size: 14px;">
              If you did not request this email, please ignore it.
            </p>
          </div>

          <!-- Footer -->
          <div style="background: #f9fafb; padding: 20px; text-align: center; font-size: 13px; color: #6b7280;">
            © ${new Date().getFullYear()} Project Ecommerce. All rights reserved.
          </div>

        </div>
      </div>
    `;

    const mailOptions: any = {
      to,
      from: `Project Ecommerce <${ENV_CONFIG.smtp_user}>`,
      subject,
      html,
    };

    if (cc) mailOptions.cc = cc;
    if (bcc) mailOptions.bcc = bcc;
    if (attachments) mailOptions.attachments = attachments;

    await transporter.sendMail(mailOptions);

    return true;
  } catch (error) {
    console.log("Email Error:", error);
    throw error;
  }
};
