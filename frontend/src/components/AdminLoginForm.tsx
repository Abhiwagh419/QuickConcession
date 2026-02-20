import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-md p-3 text-sm">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label>Email</Label>
        <Input
          type="text"
          placeholder="Admin email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        <Label>Password</Label>
        <Input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      {!otpSent ? (
        <Button type="submit" disabled={isSendingOtp} className="w-full">
          {isSendingOtp ? "Sending OTP..." : "Send OTP"}
        </Button>
      ) : (
        <>
          <div className="space-y-2">
            <Label>OTP</Label>
            <Input
              type="text"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))
              }
            />
          </div>

          <Button type="submit" disabled={isLoading} className="w-full">
            {isLoading ? "Verifying..." : "Login"}
          </Button>
        </>
      )}
      <div className="text-center pt-2">
        <button
          type="button"
          onClick={() => navigate("/staff/forgot-password")}
          className="text-sm text-accent hover:underline"
        >
          Forgot password?
        </button>
      </div>
    </form>
  );
};

export default AdminLoginForm;
