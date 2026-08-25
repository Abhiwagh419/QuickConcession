import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User, Lock, KeyRound, Mail, Loader2 } from "lucide-react";
import { apiFetch } from "@/lib/api";
import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  role: "STAFF" | "ADMIN";
}

const StaffLoginForm = () => {
  const navigate = useNavigate();
  const fieldMotion = (index: number) => ({
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.35, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] as [number, number, number, number] },
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [isSendingOtp, setIsSendingOtp] = useState(false);

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    otp?: string;
  }>({});

  const validateEmail = (value: string) => {
    if (!value.trim()) return "Email is required";
    if (!value.includes("@")) return "Invalid email";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const validateOtp = (value: string) => {
    if (!value.trim()) return "OTP is required";
    if (!/^\d{6}$/.test(value)) return "OTP must be 6 digits";
    return "";
  };

  const handleSendOtp = async () => {
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      });
      return;
    }

    setIsSendingOtp(true);
    setErrors({});

    try {
      await apiFetch("/staff/login", {
        method: "POST",
        body: JSON.stringify({
          email,
          password,
        }),
      });

      setOtpSent(true);

      toast({
        title: "OTP Sent",
        description:
          "A one-time password has been sent to your registered email address.",
      });
    } catch (err: any) {
      toast({
        title: "Login Failed",
        description: err.message || "Invalid credentials",
        variant: "destructive",
      });
    }

    setIsSendingOtp(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const otpError = validateOtp(otp);

    if (emailError || passwordError || otpError) {
      setErrors({
        email: emailError,
        password: passwordError,
        otp: otpError,
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    try {
      const res = await apiFetch("/staff/verify-otp", {
        method: "POST",
        body: JSON.stringify({
          email,
          otp,
        }),
      });

      localStorage.setItem("staffToken", res.token);

      const decoded = jwtDecode<DecodedToken>(res.token);

      toast({
        title: "Login Successful",
        description: "Welcome to QuickConcession portal.",
      });

      if (decoded.role === "ADMIN") {
        navigate("/admin/dashboard");
      } else {
        navigate("/staff/dashboard");
      }
    } catch (err: any) {
      setErrors({ otp: err.message || "Invalid OTP" });
      setIsLoading(false);
    }
  };

  return (
    <form
      onSubmit={
        otpSent
          ? handleLogin
          : (e) => {
              e.preventDefault();
              handleSendOtp();
            }
      }
      className="space-y-5 animate-fade-in"
    >
      <motion.div className="space-y-2" {...fieldMotion(0)}>
        <Label className="text-foreground font-medium">Email</Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10 form-input"
          />
        </div>
        {errors.email && (
          <p className="text-sm text-destructive animate-slide-in">
            {errors.email}
          </p>
        )}
      </motion.div>

      <motion.div className="space-y-2" {...fieldMotion(1)}>
        <Label className="text-foreground font-medium">Password</Label>
        <PasswordInput
          placeholder="Enter your password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-input"
          startAdornment={<Lock className="w-4 h-4" />}
        />
        {errors.password && (
          <p className="text-sm text-destructive animate-slide-in">
            {errors.password}
          </p>
        )}
      </motion.div>

      {!otpSent ? (
        <motion.div {...fieldMotion(2)}>
          <Button
            type="submit"
            disabled={isSendingOtp}
            className="w-full h-11 bg-[#171717] text-white hover:bg-[#171717] hover:opacity-90 transition-opacity font-medium"
          >
            {isSendingOtp ? (
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
        </motion.div>
      ) : (
        <>
          <motion.div className="space-y-2" {...fieldMotion(2)}>
            <Label className="text-foreground font-medium">
              One-Time Password (OTP)
            </Label>
            <div className="relative">
              <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Enter 6-digit OTP"
                value={otp}
                onChange={(e) =>
                  setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
                }
                className="pl-10 form-input tracking-widest"
                maxLength={6}
              />
            </div>
            {errors.otp && (
              <p className="text-sm text-destructive animate-slide-in">
                {errors.otp}
              </p>
            )}
            <p className="text-xs text-muted-foreground">
              OTP sent to your registered email address.{" "}
              <button
                type="button"
                onClick={handleSendOtp}
                className="text-black/70 hover:text-black underline underline-offset-2 font-medium"
              >
                Resend OTP
              </button>
            </p>
          </motion.div>

          <motion.div {...fieldMotion(3)}>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-[#171717] text-white hover:bg-[#171717] hover:opacity-90 transition-opacity font-medium"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Logging in...
                </>
              ) : (
                "Login"
              )}
            </Button>
          </motion.div>
        </>
      )}
      <motion.div className="text-center pt-2" {...fieldMotion(4)}>
        <Link
          to="/staff/forgot-password"
          className="text-sm text-black/70 hover:text-black underline underline-offset-2 font-medium"
        >
          Forgot password?
        </Link>
      </motion.div>
    </form>
  );
};

export default StaffLoginForm;
