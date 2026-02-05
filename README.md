# QuickConcession  
Student Railway Concession Management System

QuickConcession is a full-stack web application developed to digitize the railway concession workflow for students of Government Polytechnic Mumbai.  
The system replaces the traditional manual process with a secure, role-based online platform for students and staff.

---

## Overview

The application allows students to apply for railway concessions online and enables staff members to review, approve, or reject applications through a centralized system.  
Authentication is implemented using enrollment credentials with email-based OTP verification for additional security.

This project is developed as an academic and real-world problem–oriented system.

---

## Features

### Student
- Login using Enrollment Number and Password
- Email-based OTP verification
- Online railway concession application
- Application status tracking
- Profile management (Semester, Shift, etc.)

### Staff
- Secure staff authentication
- View student concession applications
- Approve or reject applications
- Access structured student records

---

## Tech Stack

### Frontend
- React.js
- Vite
- TypeScript

### Backend
- Node.js
- Express.js

### Database
- PostgreSQL

### Authentication
- Credential-based login
- Email OTP verification
- Role-based access control

---

## Installation & Setup

### Prerequisites
- Node.js (v18 or above recommended)
- PostgreSQL
- npm

---

### 1. Clone the Repository
```bash
git clone https://github.com/Abhiwagh419/QuickConcession.git
````

---

### 2. Environment Variables

Environment configuration files are excluded from version control and must be created manually.

#### Backend `.env`

Create a `.env` file inside the `backend` directory with the following variables:

```env
PORT=5000

DB_HOST=localhost
DB_USER=your_db_username
DB_PASSWORD=your_db_password
DB_NAME=your_database_name

EMAIL_USER=your_email_address
EMAIL_PASS=your_email_app_password

JWT_SECRET=your_secret_key
```

> Ensure the email credentials support SMTP access (App Password recommended).

---

### 3. Database Setup

* Create a PostgreSQL database
* Import the provided SQL schema (if available)
* Verify database credentials in the `.env` file

---

### 4. Backend Setup

```bash
cd backend
npm install
npm run dev
```

---

### 5. Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

---

## Security Notes

* Sensitive credentials are stored using environment variables
* OTP verification adds an additional authentication layer
* Server-side validation is enforced for all critical operations

---

## Author

Abhishek Chintamani Wagh<br>
Diploma in Computer Engineering<br>
Government Polytechnic Mumbai

---

## License

This project is intended for academic and educational use.
