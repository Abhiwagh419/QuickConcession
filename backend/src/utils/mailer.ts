import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const sendMail = async (to: string, subject: string, html: string) => {
  await resend.emails.send({
    from: "QuickConcession <onboarding@resend.dev>",
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
    "Verification Code - QuickConcession",
    `
      <h2>Hello ${studentName}</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
    `
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
    "Password Reset OTP - QuickConcession",
    `
      <h2>Hello ${studentName}</h2>
      <p>Your password reset OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
    `
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
    "Staff Login OTP - QuickConcession",
    `
      <h2>Hello ${staffName}</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
    `
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
    "Staff Password Reset OTP - QuickConcession",
    `
      <h2>Hello ${staffName}</h2>
      <p>Your OTP is:</p>
      <h1>${otp}</h1>
      <p>This OTP expires in 10 minutes.</p>
    `
  );
};