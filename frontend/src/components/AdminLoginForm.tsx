import { useState } from "react";
import { useNavigate } from "react-router-dom";
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

const AdminLoginForm = () => {
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
  const [error, setError] = useState("");

  const handleSendOtp = async () => {
    setIsSendingOtp(true);
    setError("");

    try {
      await apiFetch("/staff/login", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      });

      setOtpSent(true);

      toast({
        title: "OTP Sent",
        description: "Enter the OTP sent to your registered email.",
      });
    } catch (err: any) {
      setError("Invalid credentials.");
    }

    setIsSendingOtp(false);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await apiFetch("/staff/verify-otp", {
        method: "POST",
        body: JSON.stringify({ email, otp }),
      });

      const decoded = jwtDecode<DecodedToken>(res.token);

      if (decoded.role !== "ADMIN") {
        setError("You do not have admin privileges.");
        setIsLoading(false);
        return;
      }

      localStorage.setItem("staffToken", res.token);

      toast({
        title: "Admin Login Successful",
        description: "Welcome to Admin Dashboard.",
      });

      navigate("/admin/dashboard");
    } catch (err: any) {
      setError("Invalid or expired OTP.");
    }

    setIsLoading(false);
  };

  return (
    <form
      onSubmit={
        otpSent
          ? handleVerifyOtp
          : (e) => {
              e.preventDefault();
              handleSendOtp();
            }
      }
      className="space-y-5"
    >
      {error && (
        <motion.div
          {...fieldMotion(0)}
          className="bg-destructive/10 border border-destructive/30 text-destructive rounded-md p-3 text-sm"
        >
          {error}
        </motion.div>
      )}

      <motion.div className="space-y-2" {...fieldMotion(1)}>
        <Label>Email</Label>

        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

          <Input
            type="text"
            placeholder="Admin email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="pl-10"
          />
        </div>
      </motion.div>

      <motion.div className="space-y-2" {...fieldMotion(2)}>
        <Label>Password</Label>

        <PasswordInput
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          startAdornment={<Lock className="h-4 w-4" />}
        />
      </motion.div>

      {!otpSent ? (
        <motion.div {...fieldMotion(3)}>
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
          <motion.div className="relative" {...fieldMotion(3)}>
            <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

            <Input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
              className="pl-10"
            />
          </motion.div>

          <motion.div {...fieldMotion(4)}>
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
      <motion.div className="text-center pt-2" {...fieldMotion(5)}>
        <button
          type="button"
          onClick={() => navigate("/staff/forgot-password")}
          className="text-sm text-black/70 hover:text-black underline underline-offset-2"
        >
          Forgot password?
        </button>
      </motion.div>
    </form>
  );
};

export default AdminLoginForm;
