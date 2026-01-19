import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  KeyRound,
  Mail,
  ArrowLeft,
  Loader2,
  CheckCircle2,
  AlertCircle,
  Eye,
  EyeOff,
  Shield,
} from "lucide-react";
import LoginHeader from "@/components/LoginHeader";
import LoginFooter from "@/components/LoginFooter";
import { apiFetch } from "@/lib/api";
import PageWrapper from "@/components/PageWrapper";
type Step = "request-otp" | "reset-password";

const StaffForgotPassword = () => {
  const navigate = useNavigate();

  const [step, setStep] = useState<Step>("request-otp");

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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
      <LoginHeader />

      <PageWrapper>
        <main className="flex-1 flex items-center justify-center px-4 py-8 md:py-12">
          <div className="w-full max-w-md space-y-6">
            {/* Title Section */}
            <div className="text-center space-y-2">
              <div className="flex items-center justify-center gap-2 mb-4">
                <Shield className="w-8 h-8 text-primary" />
              </div>
              <h1 className="font-heading text-2xl md:text-3xl font-bold text-foreground">
                Staff Forgot Password
              </h1>
              <p className="text-muted-foreground text-sm md:text-base">
                {step === "request-otp"
                  ? "Enter your official email to receive a password reset OTP"
                  : "Enter the OTP and set your new password"}
              </p>
            </div>

            {/* Staff Badge */}
            <div className="flex justify-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium border border-primary/20">
                <Shield className="w-3 h-3" />
                Staff / Admin Account
              </span>
            </div>

            {/* Main Card */}
            <Card className="border-2 border-primary/20 shadow-lg">
              <CardHeader className="text-center pb-4">
                <CardTitle className="text-xl font-heading text-foreground">
                  {step === "request-otp" ? "Request OTP" : "Reset Password"}
                </CardTitle>
                <CardDescription>
                  {step === "request-otp"
                    ? "We'll send a 6-digit OTP to your registered official email"
                    : "Create a new secure password for your staff account"}
                </CardDescription>
              </CardHeader>

              <CardContent>
                {/* Success Message */}
                {successMessage && (
                  <div className="mb-4 p-3 rounded-md bg-success/10 border border-success/20 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-success flex-shrink-0" />
                    <p className="text-sm text-success">{successMessage}</p>
                  </div>
                )}

                {/* Error Message */}
                {errorMessage && (
                  <div className="mb-4 p-3 rounded-md bg-destructive/10 border border-destructive/20 flex items-center gap-2">
                    <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0" />
                    <p className="text-sm text-destructive">{errorMessage}</p>
                  </div>
                )}

                {/* Step 1: Request OTP Form */}
                {step === "request-otp" && (
                  <form onSubmit={handleRequestOtp} className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="email">Official Email ID</Label>
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
                      className="w-full btn-primary-gradient"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Sending OTP...
                        </>
                      ) : (
                        <>
                          <Mail className="w-4 h-4" />
                          Send OTP
                        </>
                      )}
                    </Button>
                  </form>
                )}

                {/* Step 2: Reset Password Form */}
                {step === "reset-password" && (
                  <form onSubmit={handleResetPassword} className="space-y-4">
                    {/* Email (Read-only) */}
                    <div className="space-y-2">
                      <Label htmlFor="email-display">Official Email ID</Label>
                      <Input
                        id="email-display"
                        type="email"
                        value={email}
                        className="form-input bg-muted"
                        disabled
                      />
                    </div>

                    {/* OTP Input */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="otp">OTP Code</Label>
                        <button
                          type="button"
                          onClick={handleResendOtp}
                          disabled={isLoading}
                          className="text-xs text-primary hover:text-primary/80 hover:underline disabled:opacity-50"
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

                    {/* New Password */}
                    <div className="space-y-2">
                      <Label htmlFor="new-password">New Password</Label>
                      <div className="relative">
                        <Input
                          id="new-password"
                          type={showPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                          className="form-input pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Must be at least 8 characters
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">
                        Confirm New Password
                      </Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          className="form-input pr-10"
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="w-4 h-4" />
                          ) : (
                            <Eye className="w-4 h-4" />
                          )}
                        </button>
                      </div>
                    </div>

                    <Button
                      type="submit"
                      className="w-full btn-primary-gradient"
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 animate-spin" />
                          Resetting Password...
                        </>
                      ) : (
                        <>
                          <KeyRound className="w-4 h-4" />
                          Reset Password
                        </>
                      )}
                    </Button>

                    {/* Back to Step 1 */}
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
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Change Email Address
                    </Button>
                  </form>
                )}

                {/* Back to Login Link */}
                <div className="mt-6 pt-4 border-t border-border">
                  <Button
                    type="button"
                    variant="link"
                    className="w-full text-muted-foreground hover:text-primary"
                    onClick={() => navigate("/")}
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Help Text */}
            <div className="bg-primary/5 rounded-lg p-4 border border-primary/10">
              <p className="text-xs text-muted-foreground text-center">
                <strong className="text-foreground">Need Help?</strong> If you
                don't receive the OTP, please check your spam folder or contact
                the IT department for assistance.
              </p>
            </div>
          </div>
        </main>

        <LoginFooter />
      </PageWrapper>
    </div>
  );
};

export default StaffForgotPassword;
