import nodemailer from "nodemailer";

export const mailer = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export async function sendMail(
  to: string,
  subject: string,
  html: string
) {
  await mailer.sendMail({
    from: `"QuickConcession" <${process.env.MAIL_USER}>`,
    to,
    subject,
    html,
  });
}
