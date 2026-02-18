import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShieldCheck, LogOut, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState<any>(null);

useEffect(() => {
  console.log("staffToken:", localStorage.getItem("staffToken"));

  apiFetch("/staff/me")
    .then(data => {
      console.log("Admin data:", data);
      setAdmin(data);
    })
    .catch(err => {
      console.error("Failed to fetch admin:", err);
    });
}, []);


  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/");
  };

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [{ label: "Dashboard", path: "/admin/dashboard" }];

    if (path.includes("/students")) {
      breadcrumbs.push({
        label: "Student Management",
        path: "/admin/students",
      });
    }

    if (path.includes("/staff")) {
      breadcrumbs.push({
        label: "Staff Management",
        path: "/admin/staff",
      });
    }

    if (path.includes("/applications")) {
      breadcrumbs.push({
        label: "Applications",
        path: "/admin/applications",
      });
    }

    if (path.includes("/settings")) {
      breadcrumbs.push({
        label: "System Settings",
        path: "/admin/settings",
      });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <header className="bg-primary border-b border-primary/20">
      <div className="px-6 py-3">
        <div className="flex items-center justify-between">
          {/* LEFT SIDE */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center border border-primary-foreground/30">
              <ShieldCheck className="w-5 h-5 text-primary-foreground" />
            </div>
            <div className="text-primary-foreground">
              <span className="font-heading font-bold text-lg">
                Government Polytechnic Mumbai
              </span>
              <p className="text-xs text-primary-foreground/70">
                Admin Portal - QuickConcession
              </p>
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="flex items-center gap-4">
            <div className="text-right text-primary-foreground hidden md:block">
             <p className="text-sm font-medium">
  {admin?.fullName}
  <span className="ml-2 px-2 py-0.5 text-xs rounded bg-primary-foreground/20">
    ADMIN
  </span>
</p>
              <p className="text-xs text-primary-foreground/70">
                Email Id: {admin?.email}
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

export default AdminHeader;
