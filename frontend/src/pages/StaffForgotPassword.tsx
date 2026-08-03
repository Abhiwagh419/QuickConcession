import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Train,
  Shield,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import PageWrapper from "@/components/PageWrapper";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type Step = "request-otp" | "reset-password";
type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.05 },
  },
};

const item = {
  hidden: { opacity: 0, y: 14 },
  show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: EASE_OUT } },
};

const StaffForgotPassword = () => {
  const navigate = useNavigate();
  const reduceMotion = useReducedMotion();

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

      setTimeout(() => navigate("/"), 2000);
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
    <div className="min-h-screen flex flex-col bg-background">
      <PageWrapper>
        <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
          {/* Soft ambient tint, matching the sign-in page */}
          <div className="absolute inset-0 -z-10" aria-hidden="true">
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 900px 600px at 50% -10%, hsl(211 84% 92% / 0.6), transparent 60%)",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 700px 500px at 100% 100%, hsl(211 84% 95% / 0.5), transparent 55%)",
              }}
            />
          </div>

          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="relative z-10 w-full max-w-[440px]"
          >
            <motion.div
              variants={item}
              className="mb-7 flex items-center justify-center gap-2.5"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary shadow-sm">
                <Train
                  className="h-4 w-4 text-primary-foreground"
                  strokeWidth={2.25}
                />
              </div>
              <span className="text-[14px] font-semibold tracking-tight text-foreground">
                QuickConcession
              </span>
            </motion.div>

            <motion.div
              variants={item}
              className="relative overflow-hidden rounded-[24px] border border-border bg-card p-8 sm:p-9"
              style={{
                boxShadow:
                  "0 1px 2px hsl(215 25% 15% / 0.04), 0 8px 24px -8px hsl(215 25% 15% / 0.10), 0 24px 48px -24px hsl(211 84% 55% / 0.16)",
              }}
            >
              <div className="mb-7 flex flex-col items-center text-center">
                <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10">
                  <Shield className="h-5 w-5 text-primary" strokeWidth={2} />
                </div>
                <span className="mb-2.5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-2.5 py-0.5 text-[10.5px] font-medium text-primary">
                  <Shield className="h-3 w-3" strokeWidth={2.2} />
                  Staff / Admin Account
                </span>
                <h1 className="text-[21px] font-semibold tracking-[-0.02em] text-foreground">
                  {step === "request-otp" ? "Forgot password" : "Reset password"}
                </h1>
                <p className="mt-1.5 text-[13px] leading-relaxed text-muted-foreground">
                  {step === "request-otp"
                    ? "Enter your official email and we'll send a reset OTP"
                    : "Enter the OTP and choose a new password"}
                </p>
              </div>

              <AnimatePresence mode="wait">
                {successMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className="mb-4 flex items-center gap-2 rounded-xl border border-success/20 bg-success/10 p-3"
                  >
                    <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
                    <p className="text-[12.5px] text-success">{successMessage}</p>
                  </motion.div>
                )}
                {errorMessage && (
                  <motion.div
                    initial={{ opacity: 0, y: reduceMotion ? 0 : -4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    role="alert"
                    className="mb-4 flex items-center gap-2 rounded-xl border border-destructive/20 bg-destructive/10 p-3"
                  >
                    <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                    <p className="text-[12.5px] text-destructive">{errorMessage}</p>
                  </motion.div>
                )}
              </AnimatePresence>

              <AnimatePresence mode="wait">
                {step === "request-otp" ? (
                  <motion.form
                    key="request"
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                    transition={{ duration: 0.22, ease: EASE_OUT }}
                    onSubmit={handleRequestOtp}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email" className="text-foreground font-medium">
                        Official Email ID
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="Enter your official email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="form-input"
                        disabled={isLoading}
                      />
                      <p className="text-xs text-muted-foreground">
                        Use your official GPM email address
                      </p>
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-primary-gradient h-11"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <Mail className="mr-2 h-4 w-4" />
                          Send OTP
                        </>
                      )}
                    </Button>
                  </motion.form>
                ) : (
                  <motion.form
                    key="reset"
                    initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                    transition={{ duration: 0.22, ease: EASE_OUT }}
                    onSubmit={handleResetPassword}
                    className="space-y-5"
                  >
                    <div className="space-y-2">
                      <Label htmlFor="email-display" className="text-foreground font-medium">
                        Official Email ID
                      </Label>
                      <Input
                        id="email-display"
                        type="email"
                        value={email}
                        className="form-input bg-muted"
                        disabled
                      />
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="otp" className="text-foreground font-medium">
                          OTP Code
                        </Label>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="text-[12px] font-medium text-accent hover:underline disabled:opacity-50"
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
                    </div>

                    <div className="space-y-2">
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
                      />
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters
                      </p>
                    </div>

                    <div className="space-y-2">
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
                      />
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-primary-gradient h-11"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <KeyRound className="mr-2 h-4 w-4" />
                          Reset Password
                        </>
                      )}
                    </Button>

                    <Button
                      type="button"
                      variant="ghost"
                      className="w-full"
                      onClick={() => {
                        setStep("request-otp");
                        setOtp("");
                        setNewPassword("");
                        setConfirmPassword("");
                        setErrorMessage("");
                        setSuccessMessage("");
                      }}
                      disabled={isLoading}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Change Email Address
                    </Button>
                  </motion.form>
                )}
              </AnimatePresence>

              <div className="mt-7 flex items-start gap-2.5 border-t border-border pt-5">
                <Button
                  type="button"
                  variant="link"
                  className="w-full text-muted-foreground hover:text-primary"
                  onClick={() => navigate("/")}
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Login
                </Button>
              </div>
            </motion.div>

            <motion.p
              variants={item}
              className="mt-5 text-center text-[11.5px] leading-relaxed text-muted-foreground"
            >
              Didn't receive the OTP? Check your spam folder or contact the IT
              department for assistance.
            </motion.p>
          </motion.div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default StaffForgotPassword;