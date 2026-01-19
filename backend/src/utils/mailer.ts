import * as nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export const sendOtpMail = async (
  to: string,
  otp: string,
  studentName: string,
) => {
  await transporter.sendMail({
    from: `"QuickConcession" <${process.env.SMTP_USER}>`,
    to,
    subject: "Verification Code for QuickConcession Student Portal",
    html: `
      <p>Hello <strong>${studentName}</strong>,</p>

      <p>
        You are receiving this email because a sign-in attempt was made for the
        <strong>QuickConcession Student Portal</strong>.
      </p>

      <p>Your One-Time Password (OTP) is:</p>
      <h2 style="letter-spacing: 2px;">${otp}</h2>

      <p>
        This OTP is valid for <strong>5 minutes</strong>.
        Please do not share it with anyone.
      </p>

      <p>
        If you did not attempt to sign in, please contact the campus IT helpdesk.
      </p>

      <p>
        Regards,<br/>
        <strong>Abhishek Wagh</strong><br/>
        Government Polytechnic, Mumbai
      </p>
    `,
  });
};

export const sendPasswordResetOtpMail = async (
  to: string,
  otp: string,
  studentName: string,
) => {
  await transporter.sendMail({
    from: `"QuickConcession" <${process.env.SMTP_USER}>`,
    to,
    subject: "QuickConcession – Password Reset OTP",
    html: `
      <p>Dear <strong>${studentName}</strong>,</p>

      <p>
        A request was received to reset your password for the
        <strong>QuickConcession Student Portal</strong>.
      </p>

      <p>Your password reset OTP is:</p>

      <h2 style="letter-spacing: 3px;">${otp}</h2>

      <p>
        This OTP is valid for <strong>10 minutes</strong>.
        Do not share it with anyone.
      </p>

      <p>
        If you did not request this password reset, please ignore this email.
      </p>

      <br />

      <p>
        Regards,<br/>
        <strong>Abhishek Wagh</strong><br/>
        Government Polytechnic, Mumbai
      </p>
    `,
  });
};

export const sendStaffPasswordResetOtpMail = async (
  to: string,
  otp: string,
  staffName: string,
) => {
  await transporter.sendMail({
    from: `"QuickConcession" <${process.env.SMTP_USER}>`,
    to,
    subject: "QuickConcession – Staff Password Reset OTP",
    html: `
      <p>Dear <strong>${staffName}</strong>,</p>

      <p>
        A request was received to reset your password for the
        <strong>QuickConcession Staff Portal</strong>.
      </p>

      <p>Your password reset OTP is:</p>

      <h2 style="letter-spacing: 3px;">${otp}</h2>

      <p>
        This OTP is valid for <strong>10 minutes</strong>.
        Please do not share it with anyone.
      </p>

      <p>
        If you did not request this reset, please contact the IT department immediately.
      </p>

      <br />

      <p>
        Regards,<br/>
        <strong>Abhishek Wagh</strong><br/>
        Government Polytechnic, Mumbai
      </p>
    `,
  });
};
