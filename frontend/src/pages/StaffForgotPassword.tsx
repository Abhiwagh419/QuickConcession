import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import AuthShell from "@/components/AuthShell";
import { apiFetch } from "@/lib/api";

type Step = "request-otp" | "reset-password";

const fieldMotion = (index: number) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
});

const StaffForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("request-otp");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Please enter a valid email address";
    return "";
  };

  const validateOtp = (value: string) => {
    if (!value.trim()) return "OTP is required";
    if (value.length !== 6 || !/^\d+$/.test(value))
      return "OTP must be 6 digits";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 8) return "Password must be at least 8 characters";
    return "";
  };

  const validateConfirmPassword = (password: string, confirm: string) => {
    if (!confirm) return "Please confirm your password";
    if (password !== confirm) return "Passwords do not match";
    return "";
  };

  const handleRequestOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const emailError = validateEmail(email);
    if (emailError) {
      setErrorMessage(emailError);
      return;
    }

    try {
      setIsLoading(true);

      await apiFetch("/auth/staff/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setSuccessMessage(
        "If the email exists, an OTP has been sent to your official email address",
      );

      setTimeout(() => {
        setStep("reset-password");
        setSuccessMessage("");
      }, 1500);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to send OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    const otpError = validateOtp(otp);
    if (otpError) return setErrorMessage(otpError);

    const passwordError = validatePassword(newPassword);
    if (passwordError) return setErrorMessage(passwordError);

    const confirmError = validateConfirmPassword(newPassword, confirmPassword);
    if (confirmError) return setErrorMessage(confirmError);

    try {
      setIsLoading(true);

      await apiFetch("/auth/staff/reset-password", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
          newPassword,
        }),
      });

      setSuccessMessage("Password reset successfully! Redirecting to login...");

      setTimeout(() => navigate("/login"), 2000);
    } catch (err: any) {
      setErrorMessage(err.message || "Invalid OTP or expired OTP");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOtp = async () => {
    try {
      setErrorMessage("");
      setIsLoading(true);

      await apiFetch("/auth/staff/forgot-password", {
        method: "POST",
        body: JSON.stringify({ email }),
      });

      setSuccessMessage("OTP resent successfully!");
      setTimeout(() => setSuccessMessage(""), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || "Failed to resend OTP");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Government Polytechnic Mumbai"
      headline={
        <>
          Reset your
          <br />
          <span className="text-white/25">password.</span>
        </>
      }
    >
      <motion.div className="mb-6" {...fieldMotion(0)}>
        <h1 className="text-[26px] font-semibold tracking-[-0.025em] text-[#171717] leading-tight">
          {step === "request-otp" ? "Forgot password" : "Set a new password"}
        </h1>
        <p className="mt-2 text-[13.5px] text-black/40 leading-snug">
          {step === "request-otp"
            ? "Enter your official email and we'll send a 6-digit OTP to reset your password."
            : "Enter the OTP and choose a new password for your account."}
        </p>
      </motion.div>

      <motion.div className="mb-6 flex justify-center" {...fieldMotion(0.5)}>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-black/10 bg-black/[0.03] px-3 py-1 text-[11px] font-medium text-black/60">
          Staff / Admin account
        </span>
      </motion.div>

      {successMessage && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-emerald-100 bg-emerald-50/60 px-3 py-2.5">
          <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
          <p className="text-[13px] text-emerald-700">{successMessage}</p>
        </div>
      )}

      {errorMessage && (
        <div className="mb-5 flex items-center gap-2 rounded-lg border border-red-100 bg-red-50/60 px-3 py-2.5">
          <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />
          <p className="text-[13px] text-red-600">{errorMessage}</p>
        </div>
      )}

      {step === "request-otp" && (
        <form onSubmit={handleRequestOtp} className="space-y-5">
          <motion.div className="space-y-2" {...fieldMotion(1)}>
            <Label htmlFor="email" className="text-foreground font-medium">
              Official Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                id="email"
                type="email"
                placeholder="Enter your official email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 form-input"
                disabled={isLoading}
              />
            </div>
          </motion.div>

          <motion.div {...fieldMotion(2)}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#171717] text-white hover:bg-[#171717] hover:opacity-90 transition-opacity font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Sending OTP...
                </>
              ) : (
                "Send OTP"
              )}
            </Button>
          </motion.div>
        </form>
      )}

      {step === "reset-password" && (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <motion.div className="space-y-2" {...fieldMotion(1)}>
            <Label className="text-foreground font-medium">
              Official Email
            </Label>
            <Input
              value={email}
              className="form-input bg-black/[0.03]"
              disabled
            />
          </motion.div>

          <motion.div className="space-y-2" {...fieldMotion(2)}>
            <div className="flex items-center justify-between">
              <Label htmlFor="otp" className="text-foreground font-medium">
                OTP Code
              </Label>
              <button
                type="button"
                onClick={handleResendOtp}
                disabled={isLoading}
                className="text-xs text-black/70 hover:text-black underline underline-offset-2 disabled:opacity-50"
              >
                Resend OTP
              </button>
            </div>
            <Input
              id="otp"
              type="text"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="form-input text-center tracking-widest text-lg"
              maxLength={6}
              disabled={isLoading}
            />
          </motion.div>

          <motion.div className="space-y-2" {...fieldMotion(3)}>
            <Label htmlFor="new-password" className="text-foreground font-medium">
              New Password
            </Label>
            <PasswordInput
              id="new-password"
              placeholder="Enter new password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="form-input"
              disabled={isLoading}
              startAdornment={<KeyRound className="w-4 h-4" />}
            />
            <p className="text-xs text-muted-foreground">
              Must be at least 8 characters
            </p>
          </motion.div>

          <motion.div className="space-y-2" {...fieldMotion(4)}>
            <Label htmlFor="confirm-password" className="text-foreground font-medium">
              Confirm New Password
            </Label>
            <PasswordInput
              id="confirm-password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="form-input"
              disabled={isLoading}
              startAdornment={<KeyRound className="w-4 h-4" />}
            />
          </motion.div>

          <motion.div {...fieldMotion(5)}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#171717] text-white hover:bg-[#171717] hover:opacity-90 transition-opacity font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Resetting Password...
                </>
              ) : (
                "Reset Password"
              )}
            </Button>
          </motion.div>

          <motion.div {...fieldMotion(6)}>
            <button
              type="button"
              onClick={() => {
                setStep("request-otp");
                setOtp("");
                setNewPassword("");
                setConfirmPassword("");
                setErrorMessage("");
                setSuccessMessage("");
              }}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 text-[13px] text-black/50 hover:text-black transition-colors disabled:opacity-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Change email
            </button>
          </motion.div>
        </form>
      )}

      <motion.div className="mt-8 pt-6 border-t border-black/[0.06] text-center" {...fieldMotion(7)}>
        <button
          onClick={() => navigate("/login")}
          className="text-[13px] text-black/50 hover:text-black transition-colors"
        >
          Back to login
        </button>
      </motion.div>
    </AuthShell>
  );
};

export default StaffForgotPassword;
