import { useState } from "react";
import {
  Train,
  Users,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import StudentLoginForm from "@/components/StudentLoginForm";
import StaffLoginForm from "@/components/StaffLoginForm";
import PageWrapper from "@/components/PageWrapper";
import AdminLoginForm from "@/components/AdminLoginForm";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];
const SPRING = { type: "spring" as const, stiffness: 420, damping: 34 };

const ROLES = [
  {
    value: "student",
    label: "Student",
    icon: GraduationCap,
    tagline: "Apply for or renew your railway concession pass",
    Form: StudentLoginForm,
  },
  {
    value: "staff",
    label: "Staff",
    icon: Users,
    tagline: "Review and verify student applications",
    Form: StaffLoginForm,
  },
  {
    value: "admin",
    label: "Admin",
    icon: ShieldCheck,
    tagline: "Manage staff access and portal records",
    Form: AdminLoginForm,
  },
] as const;

type RoleValue = (typeof ROLES)[number]["value"];

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

const Index = () => {
  const [active, setActive] = useState<RoleValue>("student");
  const reduceMotion = useReducedMotion();
  const activeRole = ROLES.find((r) => r.value === active)!;
  const ActiveForm = activeRole.Form;

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <PageWrapper>
        <div className="relative flex-1 flex items-center justify-center overflow-hidden px-4 py-12 sm:px-6">
          {/* Soft ambient tint — a single slow, subtle glow, not a dark blob field */}
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
            className="relative z-10 w-full max-w-[880px]"
          >
            {/* Brand mark */}
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
              <span className="ml-1 hidden text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground sm:inline">
                · GPM Mumbai
              </span>
            </motion.div>

            {/* Elevated card, layered soft shadow instead of a single hard drop-shadow */}
            <motion.div
              variants={item}
              className="relative overflow-hidden rounded-[24px] border border-border bg-card"
              style={{
                boxShadow:
                  "0 1px 2px hsl(215 25% 15% / 0.04), 0 8px 24px -8px hsl(215 25% 15% / 0.10), 0 24px 48px -24px hsl(211 84% 55% / 0.16)",
              }}
            >
              <div className="grid lg:grid-cols-[1fr_1.25fr]">
                {/* Role rail */}
                <div className="flex flex-col justify-between gap-9 border-b border-border bg-muted/40 p-8 lg:border-b-0 lg:border-r lg:p-10">
                  <div>
                    <p className="mb-2 text-[10.5px] font-semibold uppercase tracking-[0.18em] text-accent">
                      Railway Concession Portal
                    </p>
                    <h1 className="text-[24px] font-semibold leading-[1.2] tracking-[-0.02em] text-foreground">
                      Who's signing in?
                    </h1>
                  </div>

                  <div
                    className="relative flex flex-col gap-1.5"
                    role="tablist"
                    aria-label="Choose your portal role"
                  >
                    {ROLES.map(({ value, label, icon: Icon, tagline }) => {
                      const isActive = value === active;
                      return (
                        <button
                          key={value}
                          role="tab"
                          aria-selected={isActive}
                          onClick={() => setActive(value)}
                          className="group relative flex items-center gap-3.5 rounded-xl px-3.5 py-3 text-left transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-muted"
                        >
                          {isActive && (
                            <motion.div
                              layoutId="role-highlight"
                              className="absolute inset-0 rounded-xl bg-card shadow-sm ring-1 ring-border"
                              transition={SPRING}
                            />
                          )}
                          <div
                            className={`relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg transition-colors ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "bg-transparent text-muted-foreground group-hover:text-foreground"
                            }`}
                          >
                            <Icon className="h-4.5 w-4.5" strokeWidth={1.9} />
                          </div>
                          <div className="relative z-10 min-w-0">
                            <p
                              className={`text-[13.5px] font-semibold transition-colors ${
                                isActive ? "text-foreground" : "text-muted-foreground group-hover:text-foreground"
                              }`}
                            >
                              {label}
                            </p>
                            <p
                              className={`truncate text-[11.5px] transition-colors ${
                                isActive ? "text-muted-foreground" : "text-muted-foreground/60"
                              }`}
                            >
                              {tagline}
                            </p>
                          </div>
                        </button>
                      );
                    })}
                  </div>

                  <p className="text-[11px] leading-relaxed text-muted-foreground/70">
                    © {new Date().getFullYear()} Government Polytechnic Mumbai
                    <br />
                    Official Academic Portal
                  </p>
                </div>

                {/* Auth panel */}
                <div className="flex flex-col justify-center p-8 lg:p-11">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={active}
                      initial={{ opacity: 0, y: reduceMotion ? 0 : 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: reduceMotion ? 0 : -8 }}
                      transition={{ duration: 0.24, ease: EASE_OUT }}
                    >
                      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Sign in as {activeRole.label.toLowerCase()}
                      </p>
                      <h2 className="mb-6 text-[21px] font-semibold tracking-[-0.02em] text-foreground">
                        Welcome back
                      </h2>
                      <ActiveForm />
                    </motion.div>
                  </AnimatePresence>

                  <div className="mt-7 flex items-start gap-2.5 border-t border-border pt-5">
                    <AlertCircle
                      className="mt-[1px] h-3.5 w-3.5 shrink-0 text-muted-foreground"
                      strokeWidth={1.75}
                    />
                    <p className="text-[11.5px] leading-relaxed text-muted-foreground">
                      <span className="font-medium text-foreground/80">
                        Notice:{" "}
                      </span>
                      Contact IT Support — Mon–Fri, 10 AM – 5 PM.
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </PageWrapper>
    </div>
  );
};

export default Index;