import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

const sendMail = async (to: string, subject: string, html: string) => {
  await transporter.sendMail({
    from: `"QuickConcession" <${process.env.GMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

export const sendOtpMail = async (
  to: string,
  otp: string,
  studentName: string,
  ipAddress?: string,
  device?: string,
  loginTime?: string
) => {
  await sendMail(
    to,
    "Verification Code for QuickConcession Student Portal",
    `<h2>Hello ${studentName}</h2>
     <p>Your OTP is:</p>
     <h1>${otp}</h1>
     <p>This OTP expires in 10 minutes.</p>`
  );
};

export const sendPasswordResetOtpMail = async (
  to: string,
  otp: string,
  studentName: string,
  ipAddress?: string,
  device?: string,
  requestTime?: string
) => {
  await sendMail(
    to,
    "QuickConcession - Password Reset OTP",
    `<h2>Hello ${studentName}</h2>
     <p>Your password reset OTP is:</p>
     <h1>${otp}</h1>
     <p>This OTP expires in 10 minutes.</p>`
  );
};

export const sendStaffLoginOtpMail = async (
  to: string,
  otp: string,
  staffName: string,
  ipAddress?: string,
  device?: string,
  loginTime?: string
) => {
  await sendMail(
    to,
    "Verification Code for QuickConcession Staff Portal",
    `<h2>Hello ${staffName}</h2>
     <p>Your OTP is:</p>
     <h1>${otp}</h1>
     <p>This OTP expires in 10 minutes.</p>`
  );
};

export const sendStaffPasswordResetOtpMail = async (
  to: string,
  otp: string,
  staffName: string,
  ipAddress?: string,
  device?: string,
  requestTime?: string
) => {
  await sendMail(
    to,
    "QuickConcession - Staff Password Reset OTP",
    `<h2>Hello ${staffName}</h2>
     <p>Your OTP is:</p>
     <h1>${otp}</h1>
     <p>This OTP expires in 10 minutes.</p>`
  );
};