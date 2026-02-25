"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendStaffLoginOtpMail = exports.sendStaffPasswordResetOtpMail = exports.sendPasswordResetOtpMail = exports.sendOtpMail = void 0;
const nodemailer = __importStar(require("nodemailer"));
const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});
const sendOtpMail = async (to, otp, studentName, ipAddress, device, loginTime) => {
    await transporter.sendMail({
        from: `"QuickConcession" <${process.env.SMTP_USER}>`,
        to,
        subject: "Verification Code for QuickConcession Student Portal",
        html: `
    <!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Login Verification</title>
</head>

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
  A login attempt was detected for your account.  
  Please use the One-Time Password (OTP) below to proceed.
</p>

<!-- OTP Block -->
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

<!-- Login Details Section -->
<div style="background:#f9fafb;border:1px solid #e5e7eb;
            border-radius:8px;padding:20px;margin-bottom:30px;">

  <p style="margin:0 0 15px;font-size:14px;font-weight:bold;color:#111827;">
    Login Attempt Details
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#374151;">
    <tr>
      <td style="padding:6px 0;">
        <strong>IP Address:</strong> ${ipAddress}
      </td>
    </tr>
    <tr>
      <td style="padding:6px 0;">
        <strong>Device:</strong> ${device}
      </td>
    </tr>
    <tr>
      <td style="padding:6px 0;">
        <strong>Time:</strong> ${loginTime}
      </td>
    </tr>
  </table>

</div>

<hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />

<!-- Security Alert -->
<p style="font-size:14px;font-weight:bold;color:#111827;margin-bottom:10px;">
  Not you?
</p>

<p style="font-size:13px;color:#6b7280;line-height:1.6;">
  If this login attempt was not initiated by you, we strongly recommend 
  securing your account immediately.
</p>

<div style="text-align:center;margin:25px 0;">
  <a href="http://localhost:8080/forgot-password" 
     style="display:inline-block;background:#111827;color:#ffffff;
            padding:13px 28px;border-radius:6px;
            font-size:14px;text-decoration:none;font-weight:600;">
    Secure Your Account
  </a>
</div>

<p style="font-size:12px;color:#9ca3af;line-height:1.6;">
  For security reasons, never share your OTP or password.  
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
`
    });
};
exports.sendOtpMail = sendOtpMail;
const sendPasswordResetOtpMail = async (to, otp, studentName, ipAddress, device, requestTime) => {
    await transporter.sendMail({
        from: `"QuickConcession" <${process.env.SMTP_USER}>`,
        to,
        subject: "QuickConcession – Password Reset OTP",
        html: `
     <!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Password Reset - QuickConcession</title>
</head>

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

<!-- OTP -->
<div style="text-align:center;margin:35px 0;">
  <div style="display:inline-block;padding:20px 45px;background:#f3f4f6;
              border-radius:10px;font-size:28px;font-weight:bold;
              letter-spacing:8px;color:#111827;">
    ${otp}
  </div>
</div>

<p style="font-size:13px;color:#6b7280;margin-bottom:30px;">
  This OTP will expire in <strong>10 minutes</strong>.
</p>

<!-- Request Details -->
<div style="background:#f9fafb;border:1px solid #e5e7eb;
            border-radius:8px;padding:20px;margin-bottom:30px;">

  <p style="margin:0 0 15px;font-size:14px;font-weight:bold;color:#111827;">
    Password Reset Request Details
  </p>

  <table width="100%" cellpadding="0" cellspacing="0" style="font-size:13px;color:#374151;">
    <tr>
      <td style="padding:6px 0;">
        <strong>IP Address:</strong> ${ipAddress}
      </td>
    </tr>
    <tr>
      <td style="padding:6px 0;">
        <strong>Device:</strong> ${device}
      </td>
    </tr>
    <tr>
      <td style="padding:6px 0;">
        <strong>Time:</strong> ${requestTime}
      </td>
    </tr>
  </table>

</div>

<hr style="border:none;border-top:1px solid #e5e7eb;margin:30px 0;" />

<!-- Security Warning -->
<p style="font-size:14px;font-weight:bold;color:#111827;margin-bottom:10px;">
  Didn’t request this?
</p>

<p style="font-size:13px;color:#6b7280;line-height:1.6;">
  If you did not request a password reset, your account may be at risk.
  We recommend securing your account immediately.
</p>

<div style="text-align:center;margin:25px 0;">
  <a href="http://localhost:8080/forgot-password"
     style="display:inline-block;background:#111827;color:#ffffff;
            padding:13px 28px;border-radius:6px;
            font-size:14px;text-decoration:none;font-weight:600;">
    Secure Your Account
  </a>
</div>

<p style="font-size:12px;color:#9ca3af;line-height:1.6;">
  QuickConcession will never ask for your password via email.
  If you suspect unauthorized access, contact your institution immediately.
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
`
    });
};
exports.sendPasswordResetOtpMail = sendPasswordResetOtpMail;
const sendStaffPasswordResetOtpMail = async (to, otp, staffName, ipAddress, device, requestTime) => {
    await transporter.sendMail({
        from: `"QuickConcession" <${process.env.SMTP_USER}>`,
        to,
        subject: "QuickConcession – Staff Password Reset OTP",
        html: `
      <!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Staff Password Reset</title>
</head>

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
    Password Reset Request – Staff Portal
  </h1>
  <p style="margin:6px 0 0;color:#fecaca;font-size:13px;">
    QuickConcession Administrative Access
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
  A request has been made to reset the password for your staff account.
</p>

<p style="font-size:14px;color:#374151;line-height:1.7;margin-bottom:25px;">
  Please use the verification code below to proceed with the password reset.
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
  This code will expire in <strong>10 minutes</strong>.
</p>

<!-- Reset Details -->
<div style="background:#f8fafc;border:1px solid #e2e8f0;
            border-radius:10px;padding:22px;margin-bottom:35px;">

  <p style="margin:0 0 15px;font-size:14px;font-weight:600;color:#0f172a;">
    Reset Request Details
  </p>

  <table width="100%" cellpadding="0" cellspacing="0"
         style="font-size:13px;color:#334155;">

    <tr>
      <td style="padding:6px 0;">
        <strong>IP Address:</strong> ${ipAddress}
      </td>
    </tr>

    <tr>
      <td style="padding:6px 0;">
        <strong>Device:</strong> ${device}
      </td>
    </tr>

    <tr>
      <td style="padding:6px 0;">
        <strong>Time:</strong> ${requestTime}
      </td>
    </tr>

  </table>
</div>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:35px 0;" />

<!-- Security Alert -->
<p style="font-size:14px;font-weight:600;color:#7f1d1d;margin-bottom:12px;">
  Did not request this reset?
</p>

<p style="font-size:13px;color:#64748b;line-height:1.7;">
  If you did not initiate this password reset request,
  your account may be at risk. Please secure your account immediately
  and notify the system administrator.
</p>

<div style="text-align:center;margin:28px 0;">
  <a href="http://localhost:8080/staff/forgot-password"
     style="display:inline-block;background:#7f1d1d;color:#ffffff;
            padding:14px 30px;border-radius:8px;
            font-size:14px;text-decoration:none;font-weight:600;">
    Secure Your Account
  </a>
</div>

<p style="font-size:12px;color:#94a3b8;line-height:1.6;">
  QuickConcession will never ask for your password via email.
  Please ensure your login credentials remain confidential.
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
`,
    });
};
exports.sendStaffPasswordResetOtpMail = sendStaffPasswordResetOtpMail;
const sendStaffLoginOtpMail = async (to, otp, staffName, ipAddress, device, loginTime) => {
    await transporter.sendMail({
        from: `"QuickConcession" <${process.env.SMTP_USER}>`,
        to,
        subject: "Verification Code for QuickConcession Staff Portal",
        html: `
      <!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
<title>Staff Login Verification</title>
</head>

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

<!-- Login Details -->
<div style="background:#f8fafc;border:1px solid #e2e8f0;
            border-radius:10px;padding:22px;margin-bottom:35px;">

  <p style="margin:0 0 15px;font-size:14px;font-weight:600;color:#0f172a;">
    Login Attempt Details
  </p>

  <table width="100%" cellpadding="0" cellspacing="0"
         style="font-size:13px;color:#334155;">

    <tr>
      <td style="padding:6px 0;">
        <strong>IP Address:</strong> ${ipAddress}
      </td>
    </tr>

    <tr>
      <td style="padding:6px 0;">
        <strong>Device:</strong> ${device}
      </td>
    </tr>

    <tr>
      <td style="padding:6px 0;">
        <strong>Time:</strong> ${loginTime}
      </td>
    </tr>

  </table>
</div>

<hr style="border:none;border-top:1px solid #e2e8f0;margin:35px 0;" />

<!-- Security Alert -->
<p style="font-size:14px;font-weight:600;color:#0f172a;margin-bottom:12px;">
  Unauthorized access attempt?
</p>

<p style="font-size:13px;color:#64748b;line-height:1.7;">
  If this login attempt was not initiated by you, 
  we recommend securing your account immediately 
  and notifying the system administrator.
</p>

<div style="text-align:center;margin:28px 0;">
  <a href="http://localhost:8080/staff/forgot-password"
     style="display:inline-block;background:#0f172a;color:#ffffff;
            padding:14px 30px;border-radius:8px;
            font-size:14px;text-decoration:none;font-weight:600;">
    Secure Your Account
  </a>
</div>

<p style="font-size:12px;color:#94a3b8;line-height:1.6;">
  For security reasons, QuickConcession will never request your password via email.
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
`,
    });
};
exports.sendStaffLoginOtpMail = sendStaffLoginOtpMail;
