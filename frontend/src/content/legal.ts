export type LegalBlock =
  | { type: "p"; text: string }
  | { type: "list"; items: string[] };

export type LegalSection = {
  id: string;
  title: string;
  blocks: LegalBlock[];
};

const p = (text: string): LegalBlock => ({ type: "p", text });
const list = (items: string[]): LegalBlock => ({ type: "list", items });

export const LEGAL_LAST_UPDATED = "October 3, 2026";

export const PRIVACY_POLICY: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    blocks: [
      p(
        "QuickConcession is an internal academic portal built for Government Polytechnic Mumbai (GPM) to manage the student railway concession workflow — applying, reviewing, approving, issuing, and tracking concession passes. It is not a public consumer product; access is limited to GPM students, staff, and administrators with institution-issued credentials.",
      ),
      p(
        "This policy explains what information QuickConcession collects, why, how it's used, who it's shared with, and the choices available to you. By using QuickConcession, you acknowledge this policy. If you have questions this page doesn't answer, contact us using the details in \"Contact Us\" below.",
      ),
    ],
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    blocks: [
      p("We collect only what's needed to operate the concession workflow and keep accounts secure:"),
      list([
        "Student account data: enrollment number, full name, institutional email, mobile number, course, year, semester, shift, and — where you choose to provide them — address and date of birth.",
        "Staff and admin account data: full name, institutional email, and role.",
        "Concession application data: travel route, class, duration, status history, approval/rejection details, issued concession number, and expiry date.",
        "Authentication data: a securely hashed password and a short-lived, securely hashed one-time passcode (OTP) sent to your registered email at login and password reset. We never store OTPs or passwords in plain text.",
        "Security and device data: IP address, browser/device identifier, and timestamp, recorded at login for OTP delivery emails and to detect abuse (rate limiting).",
        "Support chat messages: if you use the in-app chat with staff, your messages are stored to maintain a record of the conversation.",
        "AI assistant (QuickChat) conversations: messages you send to QuickChat, along with the minimum account context needed to answer (e.g., your latest application status), are processed to generate a response. These are not used to answer anyone else's questions.",
      ]),
    ],
  },
  {
    id: "how-we-use",
    title: "How We Use Your Information",
    blocks: [
      list([
        "To create and authenticate your account, and verify it's really you via OTP.",
        "To process, review, approve, reject, issue, and track your concession applications.",
        "To send essential account and security emails (OTPs, status updates, security alerts).",
        "To let staff and admins respond to support queries and manage records they're authorized to access.",
        "To generate responses from QuickChat when you use it.",
        "To detect and prevent abuse — for example, rate-limiting repeated login or OTP attempts.",
        "To maintain historical records for institutional and auditing purposes.",
      ]),
      p(
        "We do not sell your personal data, and we do not use it for advertising or marketing to third parties.",
      ),
    ],
  },
  {
    id: "sharing",
    title: "How Information Is Shared",
    blocks: [
      p(
        "We don't share your data with third parties except where necessary to operate the service, or where the law requires it. The service providers we use, and what they handle, are:",
      ),
      list([
        "Resend — delivers OTP and account-related emails.",
        "Groq — processes the messages you send to QuickChat to generate a response.",
        "Firebase (Google) — stores and syncs in-app support chat messages in real time.",
        "Neon — hosts our PostgreSQL database (student, staff, and application records), currently in the AWS ap-southeast-1 (Singapore) region.",
        "Render and Vercel — host our backend API and website respectively.",
      ]),
      p(
        "Each of these providers only receives the data necessary to perform its function and is contractually/operationally restricted from using it for its own purposes. Because some of these providers operate infrastructure outside India (including in Singapore and the United States), your data may be transferred to and processed in those locations as part of normal service operation.",
      ),
      p(
        "Within the institution, your data is visible only to staff and admin accounts as needed to carry out concession review and account administration — not to other students.",
      ),
      p(
        "We may also disclose information where required to comply with a legal obligation, court order, or lawful request from a government authority.",
      ),
    ],
  },
  {
    id: "cookies",
    title: "Cookies & Local Storage",
    blocks: [
      p(
        "QuickConcession does not use advertising or third-party tracking cookies. After you complete OTP verification, your session token is stored in your browser's local storage (not a cookie) so you stay signed in. This token is used only to authenticate your requests to our own API — clearing it, or using \"sign out,\" ends your session on that device.",
      ),
    ],
  },
  {
    id: "retention",
    title: "Data Retention",
    blocks: [
      p(
        "We retain account and application records for as long as your account is active and for a reasonable period afterward, to preserve institutional and historical records (for example, past concession application history). Deactivated or removed accounts are soft-deleted — hidden from normal use but retained for record-keeping and audit purposes — rather than immediately and permanently erased, consistent with standard academic record-keeping practice.",
      ),
      p(
        "Password-reset and login OTPs expire within minutes and are marked unusable immediately after use or expiry.",
      ),
    ],
  },
  {
    id: "security",
    title: "How We Protect Your Information",
    blocks: [
      list([
        "Passwords are hashed with bcrypt before storage — we never store or can retrieve your plaintext password.",
        "Login requires both a password and an emailed OTP (two-factor authentication) for all account types.",
        "Session tokens are time-limited and expire automatically.",
        "Rate limiting is applied to login, OTP, and password-reset attempts to resist automated abuse.",
        "Traffic to QuickConcession is encrypted in transit (HTTPS).",
      ]),
      p(
        "No system is perfectly secure, and we can't guarantee absolute security. If you believe your account has been compromised, change your password immediately and contact us.",
      ),
    ],
  },
  {
    id: "your-rights",
    title: "Your Choices & Rights",
    blocks: [
      list([
        "Access & correction: you can view and update most of your profile details directly from your dashboard at any time.",
        "Password: you can reset your password yourself via the \"Forgot Password\" flow, which also requires OTP verification.",
        "Deletion or deactivation: because QuickConcession is an institutional system tied to your enrollment or employment at GPM, account deactivation or deletion requests are handled by GPM's administration — contact them, or reach us using the details below and we'll route your request.",
        "Questions about a specific decision on your application should go to the staff member or department who reviewed it, visible in your application history.",
      ]),
    ],
  },
  {
    id: "students-who-are-minors",
    title: "Students Who Are Minors",
    blocks: [
      p(
        "Some students using QuickConcession may be under 18. Their account and data are created and processed as part of their formal admission to and enrollment at Government Polytechnic Mumbai, for the limited purpose of administering their railway concession and related academic services. The Institution acts as the responsible party for this processing in connection with that enrollment. Parents/guardians with questions about a minor student's data should contact the Institution directly.",
      ),
    ],
  },
  {
    id: "children",
    title: "Children's Privacy (General Public)",
    blocks: [
      p(
        "QuickConcession is not a public service and is not directed at or intended for use by children who are not enrolled GPM students. We do not knowingly collect personal data from the general public, including children, through this system.",
      ),
    ],
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    blocks: [
      p(
        "We may update this policy from time to time to reflect changes in our practices or for legal, technical, or operational reasons. We'll update the \"Last updated\" date below when we do. Continued use of QuickConcession after a change constitutes acceptance of the revised policy.",
      ),
    ],
  },
  {
    id: "contact",
    title: "Contact Us",
    blocks: [
      p(
        "Questions, concerns, or requests regarding this policy or your personal data can be sent to privacy@quickconcession.online, or raised through the in-app Help section.",
      ),
    ],
  },
];

export const TERMS_OF_SERVICE: LegalSection[] = [
  {
    id: "acceptance",
    title: "Acceptance of Terms",
    blocks: [
      p(
        "These Terms of Service (\"Terms\") govern your access to and use of QuickConcession, an internal railway concession management portal operated for Government Polytechnic Mumbai (GPM). By logging in and using QuickConcession, you agree to these Terms. If you do not agree, please don't use the service.",
      ),
    ],
  },
  {
    id: "eligibility",
    title: "Eligibility & Accounts",
    blocks: [
      p(
        "QuickConcession is available only to current GPM students, staff, and administrators issued an account by the Institution. You may not use an account that isn't yours, share your login credentials, or attempt to access accounts, data, or areas of the system you're not authorized to access.",
      ),
      p(
        "You're responsible for keeping your password and OTP confidential, and for all activity that occurs under your account. Notify us or the Institution immediately if you suspect unauthorized access.",
      ),
    ],
  },
  {
    id: "accurate-information",
    title: "Accurate Information",
    blocks: [
      p(
        "When applying for a concession or updating your profile, you agree to provide information that is true, current, and complete. Submitting false, misleading, or fraudulent information in a concession application may result in rejection of the application, account suspension, and referral to the Institution for disciplinary action, in addition to any consequences under applicable law.",
      ),
    ],
  },
  {
    id: "acceptable-use",
    title: "Acceptable Use",
    blocks: [
      p("You agree not to:"),
      list([
        "Attempt to bypass, disable, or circumvent authentication, rate limiting, or other security controls.",
        "Use automated means (bots, scrapers) to access the service without our written permission.",
        "Probe, scan, or test the system's security, or attempt to access data belonging to other users.",
        "Use the QuickChat AI assistant to attempt to extract other users' data, generate unlawful content, or misuse the underlying service in a way that violates its provider's terms.",
        "Interfere with or disrupt the service's normal operation.",
        "Upload or transmit anything unlawful, abusive, or harmful through the support chat.",
      ]),
      p(
        "We reserve the right to suspend or terminate access for any account that violates these Terms.",
      ),
    ],
  },
  {
    id: "concession-disclaimer",
    title: "Concession Applications Are Not Guaranteed",
    blocks: [
      p(
        "QuickConcession is an administrative tool that digitizes and streamlines the concession application workflow between students and GPM staff/administration. It does not itself grant, guarantee, or confer any entitlement to a railway concession.",
      ),
      p(
        "Final eligibility, approval, issuance, and validity of any railway concession pass remain subject to the applicable rules of the concerned railway authority and the discretion of GPM's administration. Approval or issuance through this system does not override or substitute for your obligation to comply with railway authority rules, ticketing requirements, or verification checks when actually traveling.",
      ),
      p(
        "We are not responsible for, and disclaim liability for, any loss, fine, denial of travel, or other consequence arising from reliance on a concession status shown in this system, delays in processing, or a decision made by railway authorities or Institution staff.",
      ),
    ],
  },
  {
    id: "ai-disclaimer",
    title: "AI Assistant (QuickChat) Disclaimer",
    blocks: [
      p(
        "QuickChat is an AI-based assistant provided for convenience and general guidance only. Its responses — including about eligibility, application status, or process — are generated automatically and may occasionally be incomplete, out of date, or inaccurate. QuickChat is not a substitute for an official decision or confirmation from GPM staff or administration, and its output should not be treated as binding or authoritative. Where QuickChat's answer and an official decision conflict, the official decision governs.",
      ),
    ],
  },
  {
    id: "availability",
    title: "Service Availability",
    blocks: [
      p(
        "QuickConcession is provided on an \"as is\" and \"as available\" basis. We aim for reliable uptime but do not guarantee the service will be uninterrupted, error-free, or available at all times. Scheduled or emergency maintenance, third-party outages, or infrastructure issues may cause temporary unavailability.",
      ),
    ],
  },
  {
    id: "ip",
    title: "Intellectual Property",
    blocks: [
      p(
        "QuickConcession's source code, design, and underlying systems are proprietary and © the author, as described in the project's LICENSE. Your use of the service does not grant you any ownership or license to copy, modify, reverse-engineer, or redistribute the underlying software, except to the extent you're simply using it as an authorized end user for its intended purpose.",
      ),
      p(
        "Any content you submit (such as support chat messages or application details) remains associated with your account for record-keeping and operational purposes as described in our Privacy Policy.",
      ),
    ],
  },
  {
    id: "termination",
    title: "Suspension & Termination",
    blocks: [
      p(
        "The Institution may deactivate, suspend, or remove your account — for example, upon graduation, withdrawal, change in staff role, end of an academic term, a policy violation, or at its administrative discretion. We may also suspend access to protect the security or integrity of the system.",
      ),
    ],
  },
  {
    id: "liability",
    title: "Limitation of Liability",
    blocks: [
      p(
        "To the fullest extent permitted by applicable law, QuickConcession, its developer, and the Institution shall not be liable for any indirect, incidental, special, or consequential damages — including loss of data, loss of travel time, missed trains, fines, or denied concessions — arising out of or related to your use of, or inability to use, the service, even if advised of the possibility of such damages. The service is provided without warranties of any kind, express or implied, to the extent permitted by law.",
      ),
    ],
  },
  {
    id: "governing-law",
    title: "Governing Law",
    blocks: [
      p(
        "These Terms are governed by the laws of India. Any disputes arising from or relating to these Terms or the service shall be subject to the exclusive jurisdiction of the competent courts in Mumbai, Maharashtra.",
      ),
    ],
  },
  {
    id: "changes-terms",
    title: "Changes to These Terms",
    blocks: [
      p(
        "We may revise these Terms from time to time. We'll update the \"Last updated\" date below when we do, and continued use of QuickConcession after a change constitutes acceptance of the revised Terms.",
      ),
    ],
  },
  {
    id: "contact-terms",
    title: "Contact Us",
    blocks: [
      p(
        "Questions about these Terms can be sent to support@quickconcession.online, or raised through the in-app Help section.",
      ),
    ],
  },
];
