import { useNavigate, useLocation } from "react-router-dom";
import {
  GraduationCap,
  LogOut,
  User,
  ChevronRight,
  BookOpen,
} from "lucide-react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";

const StudentHeader = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [student, setStudent] = useState<any>(null);

  useEffect(() => {
    apiFetch("/student/me")
      .then(setStudent)
      .catch(() => {});
  }, []);

  const handleLogout = () => navigate("/login");

  const getBreadcrumbs = () => {
    const path = location.pathname;
    const breadcrumbs = [{ label: "Dashboard", path: "/student/dashboard" }];

    if (path.includes("/railway")) {
      breadcrumbs.push({
        label: "Railway Concession",
        path: "/student/railway",
      });
    }
    if (path.includes("/railway/apply")) {
      breadcrumbs.push({
        label: "New Application",
        path: "/student/railway/apply",
      });
    }
    if (path.includes("/profile")) {
      breadcrumbs.push({ label: "Profile", path: "/student/profile" });
    }

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();
  const currentPage = breadcrumbs[breadcrumbs.length - 1]?.label;

  const initials = student
    ? (student.fullName ?? student.name ?? "S")
        .split(" ")
        .map((w: string) => w[0])
        .join("")
        .slice(0, 2)
        .toUpperCase()
    : null;

  return (
    <div className="px-5 pt-5">
      <header className="relative rounded-xl bg-header-surface shadow-header border border-header-border backdrop-blur-sm">
        <div className="flex items-center justify-between px-6 h-[72px]">
          <div className="flex items-center gap-4 min-w-0">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-black text-white shadow-sm">
              <GraduationCap className="h-[18px] w-[18px]" />
              <div className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-[hsl(var(--header-status))] border-2 border-header-surface" />
            </div>

            <div className="min-w-0">
              <h1 className="text-[15px] font-semibold tracking-[-0.01em] text-foreground truncate leading-tight">
                Government Polytechnic Mumbai
              </h1>
              <p className="text-[11px] font-medium text-muted-foreground tracking-wide uppercase mt-0.5">
                Student Portal
              </p>
            </div>
          </div>

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

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => navigate("/student/profile")}
              className="flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150 hover:bg-black/[0.04]"
            >
              {student ? (
                <>
                  <div className="text-right hidden md:block">
                    <p className="text-[13px] font-medium text-foreground leading-tight">
                      {student.fullName}
                    </p>
                    <p className="text-[11px] text-muted-foreground mt-0.5">
                      {student.enrollmentNo}
                    </p>
                  </div>
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.04] text-black/70 text-[12px] font-semibold tracking-wide">
                    {initials}
                  </div>
                </>
              ) : (
                <div className="flex items-center gap-2.5">
                  <div className="hidden md:flex flex-col items-end gap-1.5">
                    <div className="h-3 w-24 animate-pulse bg-muted rounded" />
                    <div className="h-2.5 w-20 animate-pulse bg-muted rounded" />
                  </div>
                  <div className="h-9 w-9 animate-pulse bg-muted rounded-lg" />
                </div>
              )}
            </button>

            <div className="h-8 w-px bg-header-divider mx-1" />

            <button
              onClick={handleLogout}
              className="group flex items-center gap-2 px-3.5 py-2 text-[13px] font-medium text-muted-foreground rounded-lg transition-all duration-150 hover:bg-red-50 hover:text-destructive"
            >
              <LogOut className="h-[15px] w-[15px] transition-transform duration-150 group-hover:-translate-x-0.5" />
              <span className="hidden sm:inline">Sign out</span>
            </button>
          </div>
        </div>

        {breadcrumbs.length > 1 && (
          <div className="border-t border-header-divider px-6 h-10 flex items-center">
            <div className="flex items-center gap-2">
              <BookOpen className="h-3.5 w-3.5 text-muted-foreground/50" />
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

export default StudentHeader;
