import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { User, Lock, Loader2 } from "lucide-react";

const StaffLoginForm = () => {
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState<{
    staffId?: string;
    password?: string;
    general?: string;
  }>({});

  const validateStaffId = (value: string) => {
    if (!value.trim()) return "Staff ID is required";
    if (value.length < 4) return "Invalid Staff ID";
    return "";
  };

  const validatePassword = (value: string) => {
    if (!value) return "Password is required";
    if (value.length < 6) return "Password must be at least 6 characters";
    return "";
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const staffIdError = validateStaffId(staffId);
    const passwordError = validatePassword(password);

    if (staffIdError || passwordError) {
      setErrors({
        staffId: staffIdError,
        password: passwordError,
      });
      return;
    }

    setIsLoading(true);
    setErrors({});

    // Simulate login
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Demo: Accept any valid format credentials
    if (staffId.length >= 4 && password.length >= 6) {
      toast({
        title: "Login Successful",
        description: "Welcome to QuickConcession Staff Portal.",
      });
      navigate("/staff/dashboard");
    } else {
      setErrors({ general: "Invalid credentials. Please try again." });
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-5 animate-fade-in">
      {errors.general && (
        <div className="bg-destructive/10 border border-destructive/30 text-destructive rounded-md p-3 text-sm animate-slide-in">
          {errors.general}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="staffId" className="text-foreground font-medium">
          Staff ID
        </Label>
        <div className="relative">
          <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="staffId"
            type="text"
            placeholder="Enter your Staff ID"
            value={staffId}
            onChange={(e) => setStaffId(e.target.value)}
            className="pl-10 form-input"
          />
        </div>
        {errors.staffId && (
          <p className="text-sm text-destructive animate-slide-in">{errors.staffId}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="staffPassword" className="text-foreground font-medium">
          Password
        </Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            id="staffPassword"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="pl-10 form-input"
          />
        </div>
        {errors.password && (
          <p className="text-sm text-destructive animate-slide-in">{errors.password}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={isLoading}
        className="w-full btn-primary-gradient h-11"
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

      <div className="text-center pt-2">
        <a href="#" className="text-sm text-accent hover:underline font-medium">
          Forgot Password?
        </a>
      </div>
    </form>
  );
};

export default StaffLoginForm;
