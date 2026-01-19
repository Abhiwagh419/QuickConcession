import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { GraduationCap, LogOut, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const StaffHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [staff, setStaff] = useState<any>(null);
  useEffect(() => {
    apiFetch("/staff/me")
      .then(setStaff)
      .catch(() => {});
  }, []);
  const handleLogout = () => {
    navigate("/");
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [{ label: "Dashboard", path: "/staff/dashboard" }];

    if (path.includes("/railway")) {
      breadcrumbs.push({
        label: "Railway Concession Management",
        path: "/staff/railway",
      });
    }
    if (path.includes("/railway/process")) {
      breadcrumbs.push({ label: "Process Application", path: path });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-primary border-b border-primary/20">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/30">
              <GraduationCap className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-primary-foreground">
              <span className="font-heading font-bold text-lg">
                Government Polytechnic Mumbai
              </span>
              <p className="text-xs text-primary-foreground/70">
                Staff Portal - QuickConcession
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right text-primary-foreground hidden md:block">
              <p className="text-sm font-medium">{staff?.fullName}</p>
              <p className="text-xs text-primary-foreground/70">
                Email Id: {staff?.email}
              </p>
            </div>
            <Button
              variant="ghost"
              onClick={handleLogout}
              className="text-primary-foreground hover:bg-primary-foreground/10"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Breadcrumbs */}
      {breadcrumbs.length > 1 && (
        <div className="px-6 py-2 bg-secondary border-t border-border">
          <nav className="flex items-center gap-1 text-sm">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-1">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-muted-foreground" />
                )}
                <button
                  onClick={() => navigate(crumb.path)}
                  className={`hover:underline ${
                    index === breadcrumbs.length - 1
                      ? "text-foreground font-medium"
                      : "text-muted-foreground"
                  }`}
                >
                  {crumb.label}
                </button>
              </div>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default StaffHeader;
