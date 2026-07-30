"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isValidEmail = isValidEmail;
exports.isValidPassword = isValidPassword;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
function isValidEmail(email) {
    return typeof email === "string" && EMAIL_RE.test(email);
}
function isValidPassword(password, minLength = 6) {
    return typeof password === "string" && password.length >= minLength;
}
