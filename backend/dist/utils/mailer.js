"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendStaffPasswordResetOtpMail = exports.sendStaffLoginOtpMail = exports.sendPasswordResetOtpMail = exports.sendOtpMail = void 0;
const resend_1 = require("resend");
const resend = new resend_1.Resend(process.env.RESEND_API_KEY);
const sendMail = async (to, subject, html) => {
  try {
    await resend.emails.send({
      from: "QuickConcession <otp@quickconcession.online>",
      to,
      subject,
      html,
    });
  }
  catch (error) {
    console.error("Resend error:", error?.message || error);
    throw error;
  }
};
const sendOtpMail = async (to, otp, studentName, ipAddress, device, loginTime) => {
  await sendMail(to, "Verification Code for QuickConcession Student Portal", `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f4f6f8;">
<tr>
<td align="center">

<table width="620" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;
box-shadow:0 10px 35px rgba(0,0,0,0.06);">

<tr>
<td style="background:#111827;padding:28px;text-align:center;">
  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">
    QuickConcession
  </h1>
  <p style="margin:6px 0 0;color:#9ca3af;font-size:13px;">
    Railway Concession Management System
  </p>
</td>
</tr>

<tr>
<td style="padding:40px;">

<p style="font-size:16px;color:#111827;margin:0 0 18px;">
  Dear ${studentName},
</p>

<p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 25px;">
  A login attempt was detected for your account.  
  Please use the One-Time Password (OTP) below to proceed.
</p>

<div style="text-align:center;margin:35px 0;">
  <div style="display:inline-block;padding:20px 45px;background:#f3f4f6;
              border-radius:10px;font-size:28px;font-weight:bold;
              letter-spacing:8px;color:#111827;">
    ${otp}
  </div>
</div>

<p style="font-size:13px;color:#6b7280;margin:0 0 30px;">
  This verification code will expire in <strong>10 minutes</strong>.
  Do not share this code with anyone.
</p>

${ipAddress
      ? `
<div style="background:#f9fafb;border:1px solid #e5e7eb;
            border-radius:8px;padding:20px;margin-bottom:30px;">
  <p style="margin:0 0 15px;font-size:14px;font-weight:bold;color:#111827;">
    Login Attempt Details
  </p>
  <p style="font-size:13px;color:#374151;">
    IP Address: ${ipAddress}<br/>
    Device: ${device}<br/>
    Time: ${loginTime}
  </p>
</div>`
      : ""}

</td>
</tr>

<tr>
<td style="background:#f9fafb;padding:22px;text-align:center;">
  <p style="font-size:12px;color:#9ca3af;margin:0;">
    © ${new Date().getFullYear()} QuickConcession
  </p>
  <p style="font-size:12px;color:#9ca3af;margin:6px 0 0;">
    Government Polytechnic Mumbai
  </p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`);
};
exports.sendOtpMail = sendOtpMail;
const sendPasswordResetOtpMail = async (to, otp, studentName, ipAddress, device, requestTime) => {
  await sendMail(to, "QuickConcession – Password Reset OTP", `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#f4f6f8;">
<tr>
<td align="center">

<table width="620" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:12px;overflow:hidden;
box-shadow:0 10px 35px rgba(0,0,0,0.06);">

<!-- Header -->
<tr>
<td style="background:#111827;padding:28px;text-align:center;">
  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">
    QuickConcession
  </h1>
  <p style="margin:6px 0 0;color:#9ca3af;font-size:13px;">
    Railway Concession Management System
  </p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:40px;">

<p style="font-size:16px;color:#111827;margin:0 0 18px;">
  Dear ${studentName},
</p>

<p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 25px;">
  We received a request to reset your account password.
  Please use the verification code below to proceed.
</p>

<!-- OTP Block -->
<div style="text-align:center;margin:35px 0;">
  <div style="display:inline-block;padding:20px 45px;background:#f3f4f6;
              border-radius:10px;font-size:28px;font-weight:bold;
              letter-spacing:8px;color:#111827;">
    ${otp}
  </div>
</div>

<p style="font-size:13px;color:#6b7280;margin-bottom:30px;">
  This OTP will expire in <strong>10 minutes</strong>.
  If you did not request this reset, please ignore this email.
</p>

${ipAddress
      ? `
<div style="background:#f9fafb;border:1px solid #e5e7eb;
            border-radius:8px;padding:20px;margin-bottom:30px;">
  <p style="margin:0 0 15px;font-size:14px;font-weight:bold;color:#111827;">
    Reset Request Details
  </p>
  <p style="font-size:13px;color:#374151;">
    IP Address: ${ipAddress}<br/>
    Device: ${device}<br/>
    Time: ${requestTime}
  </p>
</div>`
      : ""}

<p style="font-size:12px;color:#9ca3af;line-height:1.6;">
  QuickConcession will never ask for your password via email.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f9fafb;padding:22px;text-align:center;">
  <p style="font-size:12px;color:#9ca3af;margin:0;">
    © ${new Date().getFullYear()} QuickConcession
  </p>
  <p style="font-size:12px;color:#9ca3af;margin:6px 0 0;">
    Government Polytechnic Mumbai
  </p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`);
};
exports.sendPasswordResetOtpMail = sendPasswordResetOtpMail;
const sendStaffLoginOtpMail = async (to, otp, staffName, ipAddress, device, loginTime) => {
  await sendMail(to, "Verification Code for QuickConcession Staff Portal", `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#eef2f7;">
<tr>
<td align="center">

<table width="640" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:14px;overflow:hidden;
box-shadow:0 12px 40px rgba(0,0,0,0.07);">

<!-- Header -->
<tr>
<td style="background:#0f172a;padding:30px;text-align:center;">
  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">
    QuickConcession – Staff Portal
  </h1>
  <p style="margin:6px 0 0;color:#94a3b8;font-size:13px;">
    Secure Administrative Access
  </p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:45px;">

<p style="font-size:16px;color:#111827;margin:0 0 18px;">
  Dear ${staffName},
</p>

<p style="font-size:14px;color:#374151;line-height:1.7;margin:0 0 25px;">
  A login attempt has been detected for your staff account in the 
  QuickConcession Management System.
</p>

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:25px;">
  Please use the verification code below to complete authentication.
</p>

<!-- OTP Block -->
<div style="text-align:center;margin:40px 0;">
  <div style="display:inline-block;padding:22px 50px;background:#f1f5f9;
              border-radius:12px;font-size:30px;font-weight:bold;
              letter-spacing:8px;color:#0f172a;">
    ${otp}
  </div>
</div>

<p style="font-size:13px;color:#64748b;margin-bottom:30px;">
  This code will expire in <strong>10 minutes</strong>.
  Never share this code with anyone.
</p>

${ipAddress
      ? `
<div style="background:#f8fafc;border:1px solid #e2e8f0;
            border-radius:10px;padding:22px;margin-bottom:35px;">
  <p style="margin:0 0 15px;font-size:14px;font-weight:600;color:#0f172a;">
    Login Attempt Details
  </p>
  <p style="font-size:13px;color:#334155;">
    IP Address: ${ipAddress}<br/>
    Device: ${device}<br/>
    Time: ${loginTime}
  </p>
</div>`
      : ""}

<p style="font-size:12px;color:#94a3b8;line-height:1.6;">
  If this login attempt was not initiated by you, please secure your account immediately.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f8fafc;padding:24px;text-align:center;">
  <p style="font-size:12px;color:#94a3b8;margin:0;">
    © ${new Date().getFullYear()} QuickConcession
  </p>
  <p style="font-size:12px;color:#94a3b8;margin:6px 0 0;">
    Government Polytechnic Mumbai
  </p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`);
};
exports.sendStaffLoginOtpMail = sendStaffLoginOtpMail;
const sendStaffPasswordResetOtpMail = async (to, otp, staffName, ipAddress, device, requestTime) => {
  await sendMail(to, "QuickConcession – Staff Password Reset OTP", `
<!DOCTYPE html>
<html>
<body style="margin:0;padding:0;background:#eef2f7;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="padding:40px 0;background:#eef2f7;">
<tr>
<td align="center">

<table width="640" cellpadding="0" cellspacing="0"
style="background:#ffffff;border-radius:14px;overflow:hidden;
box-shadow:0 12px 40px rgba(0,0,0,0.07);">

<!-- Header -->
<tr>
<td style="background:#7f1d1d;padding:30px;text-align:center;">
  <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:600;">
    QuickConcession – Staff Portal
  </h1>
  <p style="margin:6px 0 0;color:#fecaca;font-size:13px;">
    Administrative Password Reset
  </p>
</td>
</tr>

<!-- Body -->
<tr>
<td style="padding:45px;">

<p style="font-size:16px;color:#111827;margin:0 0 18px;">
  Dear ${staffName},
</p>

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:25px;">
  A request has been made to reset your staff account password.
</p>

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:25px;">
  Please use the verification code below to proceed securely.
</p>

<!-- OTP Block -->
<div style="text-align:center;margin:40px 0;">
  <div style="display:inline-block;padding:22px 50px;background:#fee2e2;
              border-radius:12px;font-size:30px;font-weight:bold;
              letter-spacing:8px;color:#7f1d1d;">
    ${otp}
  </div>
</div>

<p style="font-size:13px;color:#64748b;margin-bottom:30px;">
  This OTP will expire in <strong>10 minutes</strong>.
  Do not share this code with anyone.
</p>

${ipAddress
      ? `
<div style="background:#f8fafc;border:1px solid #e2e8f0;
            border-radius:10px;padding:22px;margin-bottom:35px;">

  <p style="margin:0 0 15px;font-size:14px;font-weight:600;color:#0f172a;">
    Reset Request Details
  </p>

  <p style="font-size:13px;color:#334155;">
    IP Address: ${ipAddress}<br/>
    Device: ${device}<br/>
    Time: ${requestTime}
  </p>

</div>`
      : ""}

<hr style="border:none;border-top:1px solid #e2e8f0;margin:35px 0;" />

<p style="font-size:13px;color:#64748b;line-height:1.7;">
  If you did not request this password reset, please secure your account immediately
  and inform the system administrator.
</p>

</td>
</tr>

<!-- Footer -->
<tr>
<td style="background:#f8fafc;padding:24px;text-align:center;">
  <p style="font-size:12px;color:#94a3b8;margin:0;">
    © ${new Date().getFullYear()} QuickConcession
  </p>
  <p style="font-size:12px;color:#94a3b8;margin:6px 0 0;">
    Government Polytechnic Mumbai
  </p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>
`);
};
exports.sendStaffPasswordResetOtpMail = sendStaffPasswordResetOtpMail;
