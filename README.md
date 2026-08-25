# QuickConcession

**Student Railway Concession Management System**

QuickConcession is a full-stack web application built to digitize the railway concession workflow for students of Government Polytechnic Mumbai. It replaces the manual, paper-based process with a secure, role-based platform spanning three tiers of access — **Student**, **Staff**, and **Admin** — covering everything from application submission to approval, issuance, expiry, and reporting.

**Live Demo:** [quickconcession.online](https://quickconcession.online)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Project Structure](#project-structure)
- [Installation & Setup](#installation--setup)
- [Security Notes](#security-notes)
- [Author](#author)
- [License](#license)

---

## Overview

QuickConcession allows students to apply for railway concessions online and enables staff and administrators to review, approve, reject, and issue applications through a centralized dashboard. Authentication for both students and staff uses credential-based login combined with email OTP verification. An admin tier sits above staff, with full control over student and staff records, bulk data import, analytics, and system-wide reporting.

This project was designed and built end-to-end — from database schema to deployment — as a real-world system addressing a genuine institutional workflow, not a tutorial or template project.

---

## Features

### Student
- Login using Enrollment Number and Password, with email OTP verification
- Forgot password flow with OTP-based reset
- Submit new railway concession applications (station, route/line, class, duration)
- Track application status (Pending / Approved / Rejected / Issued / Expired)
- View and update profile details (course, year, semester, shift, address, DOB)
- In-app real-time chat with staff for query resolution

### Staff
- Secure login with email OTP verification and dedicated password reset flow
- View, approve, or reject student concession applications
- Manage and search student records
- Access a railway route/station management panel
- Real-time chat with students

### Admin
- All staff capabilities, plus full administrative control
- Dashboard with system-wide analytics (total students, staff, applications, and status breakdown)
- Create, update, activate/deactivate, soft-delete, and restore student and staff accounts
- Reset student and staff passwords directly
- Bulk import students and staff via CSV, with row-level validation and a preview/confirm step before committing to the database
- Export students, staff, and applications to Excel
- Per-student analytics (approval rate, application history breakdown)
- Full visibility into every concession application across the system

### System-level
- Automatic expiry of issued concessions via a scheduled cron job
- Role-based access control enforced at the API level (Student / Staff / Admin)
- Centralized email delivery for OTPs and notifications

---

## Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React, Vite, TypeScript, Tailwind CSS, shadcn/ui, Radix UI, React Router, React Query, React Hook Form + Zod, Recharts, Framer Motion |
| **Backend** | Node.js, Express 5, TypeScript |
| **Database & ORM** | PostgreSQL, Prisma |
| **Authentication** | JWT, bcrypt, email OTP verification, role-based access control (Student / Staff / Admin) |
| **Email Delivery** | Resend |
| **Real-time Chat** | Firebase (Firestore) |
| **Data Tools** | ExcelJS (export), csv-parse (bulk import), Multer (file uploads) |
| **Scheduling** | node-cron (automatic concession expiry) |
| **Security Middleware** | Helmet, CORS |
| **Deployment** | Vercel (frontend), Render (backend) |

---

## Project Structure

```
QuickConcession/
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma        # Student, Staff, ConcessionApplication, OTP models
│   │   └── migrations/
│   └── src/
│       ├── controllers/         # Student, staff, and admin business logic
│       ├── routes/               # /auth, /student, /staff, /admin, /concession
│       ├── middleware/           # requireAuth, requireStaff, requireAdmin
│       ├── cron/                 # Scheduled concession expiry
│       └── utils/                # Mailer, OTP, JWT, password helpers
└── frontend/
    └── src/
        ├── pages/                 # Student, Staff, and Admin dashboards & flows
        ├── components/            # Shared UI, role-specific forms and dialogs
        ├── features/chat/         # Real-time student–staff chat
        └── api/                   # Axios clients per role
```

---

## Installation & Setup

> **Note:** These setup instructions are provided for transparency and evaluation purposes only. Running this code locally does not grant any rights to use, modify, or redistribute it. See [License](#license).

### Prerequisites
- Node.js (v18 or above recommended)
- PostgreSQL
- npm

### 1. Clone the Repository

```bash
git clone https://github.com/Abhiwagh419/QuickConcession.git
```

### 2. Environment Variables

Environment configuration files are excluded from version control and must be created manually.

**Backend `.env`** (inside the `backend` directory)

```env
PORT=4000

DATABASE_URL=postgresql://your_db_username:your_db_password@localhost:5432/your_database_name

JWT_SECRET=your_secret_key

RESEND_API_KEY=your_resend_api_key

MAIL_USER=your_email_address
MAIL_PASS=your_email_app_password

OTP_EXPIRY_MINUTES=10
```

> Email delivery uses [Resend](https://resend.com) as the primary provider, with Nodemailer/Gmail as a secondary path — configure whichever your deployment relies on.

**Frontend `.env`** (inside the `frontend` directory)

```env
VITE_API_URL=http://localhost:4000
```

### 3. Database Setup

The schema is managed with Prisma. From the `backend` directory:

```bash
npx prisma migrate deploy
npx prisma generate
```

This creates the `Student`, `Staff`, `ConcessionApplication`, and `OtpVerification` tables along with all required enums.

### 4. Backend Setup

```bash
cd backend
npm install
npm run dev
```

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Security Notes

- Passwords are hashed with bcrypt before storage; plaintext credentials are never persisted
- Sensitive configuration (database URL, JWT secret, email provider keys) is managed via environment variables, excluded from version control
- OTP verification adds a second authentication factor for both student and staff logins
- All admin and staff routes are protected by role-based middleware (`requireAuth`, `requireStaff`, `requireAdmin`) enforced server-side
- Helmet is used to set secure HTTP headers, and CORS is restricted to a defined allowlist of origins
- Soft-delete is used for student and staff records, preserving historical data integrity while restricting access

---

## Author

**Abhishek Chintamani Wagh**
Diploma in Computer Engineering
Government Polytechnic Mumbai

[GitHub](https://github.com/Abhiwagh419)

---

## License

This project is **source-available for viewing purposes only**. All rights are reserved by the author.

No part of this codebase — including its design, structure, or logic — may be copied, modified, distributed, sublicensed, or used in any other project, whether personal, academic, or commercial, without explicit prior written permission from the author.

See the [LICENSE](./LICENSE) file for full terms.