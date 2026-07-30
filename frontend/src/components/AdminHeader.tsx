import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, LogOut, ChevronRight, Settings } from "lucide-react";
import { useEffect, useState } from "react";

const AdminHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [admin, setAdmin] = useState<any>(null);

  useEffect(() => {
    const token = localStorage.getItem("staffToken");
    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));
    setAdmin({
      fullName: payload.name,
      email: payload.email,
    });
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("staffToken");
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
      breadcrumbs.push({ label: "Staff Management", path: "/admin/staff" });
    }
    if (path.includes("/applications")) {
      breadcrumbs.push({ label: "Applications", path: "/admin/applications" });
    }
    if (path.includes("/settings")) {
      breadcrumbs.push({ label: "System Settings", path: "/admin/settings" });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPage = breadcrumbs[breadcrumbs.length - 1]?.label;

  const initials = admin
    ? (admin.fullName ?? "A")
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : null;

  return (
    <div className="px-5 pt-5">
      <header className="relative rounded-xl bg-header-surface shadow-header border border-header-border backdrop-blur-sm">
        {/* Main bar */}
        <div className="flex items-center justify-between px-6 h-[72px]">
          {/* LEFT — Brand identity */}
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <ShieldCheck className="h-[18px] w-[18px]" />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--header-status))] border-2 border-header-surface" />
            </div>

            <div className="min-w-0">
              <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground truncate leading-tight">
                QuickConcession
              </h1>
              <p className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase mt-0.5">
                Admin Portal
              </p>
            </div>
          </div>

          {/* CENTER — Navigation context */}
          <div className="hidden lg:flex items-center gap-3">
            {breadcrumbs.map((crumb, index) => (
              <div key={crumb.path} className="flex items-center gap-3">
                {index > 0 && (
                  <ChevronRight className="h-3 w-3 text-muted-foreground/40" />
                )}
                <button
                  onClick={() => navigate(crumb.path)}
                  className={`text-[13px] font-medium transition-colors duration-150 ${
                    index === breadcrumbs.length - 1
                      ? "text-foreground"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {crumb.label}
                </button>
              </div>
            ))}
          </div>

          {/* RIGHT — User controls */}
          <div className="flex items-center gap-2 shrink-0">
            {/* Admin identity */}
            <div className="flex items-center gap-3">
              {admin ? (
                <>
                  <div className="text-right hidden md:block">
                    <div className="flex items-center justify-end gap-2">
                      <p className="text-[13px] font-medium text-foreground leading-tight">
                        {admin.fullName}
                      </p>
                      <span className="px-1.5 py-0.5 text-[10px] font-semibold tracking-wider uppercase rounded bg-primary/[0.08] text-primary">
                        Admin
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {admin.email}
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/[0.08] text-primary text-[12px] font-semibold tracking-wide">
                    {initials}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-3">
                  <div className="hidden md:flex flex-col items-end gap-1.5">
                    <div className="h-3 w-24 animate-pulse bg-muted rounded" />
                    <div className="h-2.5 w-32 animate-pulse bg-muted rounded" />
                  </div>
                  <div className="h-9 w-9 animate-pulse bg-muted rounded-lg" />
                </div>
              )}
            </div>

            {/* Divider */}
            <div className="h-8 w-px bg-header-divider mx-1" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-muted-foreground rounded-lg transition-all duration-150 hover:bg-destructive/[0.06] hover:text-destructive"
            >
              <LogOut className="h-[15px] w-[15px] transition-transform duration-150 group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {/* Bottom context strip — only on deeper pages */}
        {breadcrumbs.length > 1 && (
          <div className="border-t border-header-divider px-6 h-10 flex items-center">
            <div className="flex items-center gap-2">
              <Settings className="h-3.5 w-3.5 text-muted-foreground/50" />
              <span className="text-[12px] font-medium text-muted-foreground">
                {currentPage}
              </span>
            </div>
          </div>
        )}
      </header>
    </div>
  );
};

export default AdminHeader;
