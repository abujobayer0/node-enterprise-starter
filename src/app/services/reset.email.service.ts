import nodemailer from "nodemailer";
import config from "../../config";

export const sendPasswordResetEmail = async (to: string, resetLink: string) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: config.EMAIL_USER,
      pass: config.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: config.EMAIL_USER,
    to,
    subject: "Password Reset Request",
    html: `
  <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
    <h2 style="color: #333; text-align: center;">Password Reset</h2>
    <p style="font-size: 16px; color: #555;">
      Hello,
    </p>
    <p style="font-size: 16px; color: #555;">
      You have requested to reset your password. Please click the link below to proceed:
    </p>
    <div style="text-align: center; margin: 20px 0;">
      <a href="${resetLink}" style="background-color: #007bff; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">Reset Password</a>
    </div>
    <p style="font-size: 16px; color: #555;">
      If the button above does not work, copy and paste the following link into your browser:
    </p>
    <p style="font-size: 14px; color: #007bff; word-wrap: break-word;">
      ${resetLink}
    </p>
    <p style="font-size: 16px; color: #555;">
      If you did not request this, please ignore this email.
    </p>
    <hr style="margin-top: 20px; border: 0; border-top: 1px solid #ddd;">
    <p style="font-size: 12px; color: #aaa; text-align: center;">
      © ${new Date().getFullYear()} Your Company. All rights reserved.
    </p>
  </div>
  `,
  };

  await transporter.sendMail(mailOptions);
};
