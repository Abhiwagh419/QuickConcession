import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Train,
  Users,
  GraduationCap,
  ShieldCheck,
  AlertCircle,
} from "lucide-react";
import LoginFooter from "@/components/LoginFooter";
import StudentLoginForm from "@/components/StudentLoginForm";
import StaffLoginForm from "@/components/StaffLoginForm";
import PageWrapper from "@/components/PageWrapper";
import AdminLoginForm from "@/components/AdminLoginForm";
import { motion } from "framer-motion";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const TAB_CONFIG = [
  { value: "student", label: "Student", icon: GraduationCap },
  { value: "staff",   label: "Staff",   icon: Users },
  { value: "admin",   label: "Admin",   icon: ShieldCheck },
];

const Index = () => {
  const [activeTab, setActiveTab] = useState("student");

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <PageWrapper>

        {/* ═══════════════════════════════════════════════════════════
            MOBILE  (hidden lg+)
            Concept: dark hero → white sheet slides up from bottom
        ═══════════════════════════════════════════════════════════ */}
        <div className="flex flex-col lg:hidden min-h-screen relative overflow-hidden">

          {/* ── Dark hero ── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="relative z-0 flex-shrink-0 px-6 pt-12 pb-20"
          >
            {/* Noise texture */}
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: "160px 160px",
              }}
            />

            {/* Wordmark row */}
            <div className="relative z-10 flex items-center justify-between mb-12">
              <div className="flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-lg bg-white flex items-center justify-center">
                  <Train className="h-3.5 w-3.5 text-[#0a0a0a]" strokeWidth={2.2} />
                </div>
                <span className="text-[13.5px] font-semibold text-white tracking-tight">
                  QuickConcession
                </span>
              </div>
              <span className="text-[9.5px] font-medium tracking-[0.16em] uppercase text-white/25">
                GPM · Mumbai
              </span>
            </div>

            {/* Big hero type */}
            <div className="relative z-10">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-4">
                Railway Concession Portal
              </p>
              <h1 className="text-[40px] font-semibold leading-[1.05] tracking-[-0.03em] text-white">
                Your pass,
                <br />
                <span className="text-white/25">your journey.</span>
              </h1>
            </div>
          </motion.div>

          {/* ── White form sheet ── */}
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.08 }}
            className="
              relative z-10 flex-1
              bg-white
              rounded-t-[28px]
              -mt-6
              px-6 pt-8 pb-10
              flex flex-col
            "
          >
            {/* Drag pill */}
            <div className="mx-auto w-10 h-1 rounded-full bg-slate-200 mb-7" />

            {/* Sign-in label */}
            <div className="mb-6">
              <p className="text-[11px] font-semibold tracking-[0.14em] uppercase text-slate-400 mb-1">
                Access portal
              </p>
              <h2 className="text-[20px] font-semibold tracking-[-0.02em] text-slate-950">
                Sign in to continue
              </h2>
            </div>

            {/* Role selector — dark pill switcher */}
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full flex-1 flex flex-col">
              <TabsList className="grid grid-cols-3 w-full h-11 rounded-xl bg-slate-950 p-1 mb-7">
                {TAB_CONFIG.map(({ value, label, icon: Icon }) => (
                  <TabsTrigger
                    key={value}
                    value={value}
                    className="
                      flex items-center justify-center gap-1.5
                      h-full rounded-lg
                      text-[11.5px] font-medium text-white/40
                      transition-all duration-150
                      data-[state=active]:bg-white
                      data-[state=active]:text-slate-950
                      data-[state=active]:font-semibold
                      data-[state=active]:shadow-none
                    "
                  >
                    <Icon className="h-3 w-3 shrink-0" strokeWidth={2} />
                    {label}
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="flex-1">
                <TabsContent value="student" className="mt-0">
                  <StudentLoginForm />
                </TabsContent>
                <TabsContent value="staff" className="mt-0">
                  <StaffLoginForm />
                </TabsContent>
                <TabsContent value="admin" className="mt-0">
                  <AdminLoginForm />
                </TabsContent>
              </div>
            </Tabs>

            {/* Notice */}
            <div className="mt-6 pt-5 border-t border-slate-100 flex items-start gap-2">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-[1px] text-slate-300" strokeWidth={1.75} />
              <p className="text-[11px] leading-relaxed text-slate-400">
                <span className="font-medium text-slate-500">Notice: </span>
                Contact IT Support —{" "}
                <span className="font-medium text-slate-500">Mon–Fri, 10 AM – 5 PM</span>.
              </p>
            </div>

            <p className="mt-6 text-center text-[10px] text-slate-300">
              © {new Date().getFullYear()} Government Polytechnic Mumbai
            </p>
          </motion.div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            DESKTOP  (hidden below lg)
            Concept: full-bleed dark left, white right, no card
        ═══════════════════════════════════════════════════════════ */}
        <div className="hidden lg:flex flex-1 min-h-screen">

          {/* Left — dark hero panel */}
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="relative lg:w-[44%] xl:w-[40%] flex flex-col justify-between bg-[#0a0a0a] px-12 xl:px-16 py-12 overflow-hidden"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: "180px 180px",
              }}
            />
            <div className="absolute right-0 top-0 bottom-0 w-px bg-white/[0.06]" />

            {/* Wordmark */}
            <div className="relative z-10 flex items-center gap-3">
              <div className="h-7 w-7 flex items-center justify-center rounded-md bg-white">
                <Train className="h-3.5 w-3.5 text-[#0a0a0a]" strokeWidth={2.25} />
              </div>
              <span className="text-[14px] font-semibold tracking-tight text-white">
                QuickConcession
              </span>
            </div>

            {/* Hero copy */}
            <div className="relative z-10 space-y-10">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="h-px w-6 bg-white/20" />
                  <span className="text-[10.5px] font-medium tracking-[0.18em] uppercase text-white/35">
                    Government Polytechnic Mumbai
                  </span>
                </div>
                <h2 className="text-[38px] xl:text-[44px] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
                  Railway
                  <br />
                  concessions,
                  <br />
                  <span className="text-white/25">simplified.</span>
                </h2>
              </div>
              <div className="flex items-center gap-8 pt-2">
                {[
                  { val: "100%", label: "Digital" },
                  { val: "∞",    label: "Trackable" },
                  { val: "24h",  label: "Access" },
                ].map(({ val, label }) => (
                  <div key={label} className="space-y-1">
                    <p className="text-[18px] font-semibold text-white tracking-tight">{val}</p>
                    <p className="text-[11px] text-white/25 font-medium">{label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-[11px] text-white/20 tracking-wide">
                © {new Date().getFullYear()} · Official Academic Portal
              </p>
            </div>
          </motion.aside>

          {/* Right — cardless form */}
          <motion.main
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
            className="flex-1 flex flex-col bg-white"
          >
            <div className="flex-1 flex items-center justify-center px-12 xl:px-20 py-14">
              <div className="w-full max-w-[380px]">

                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.45, ease: EASE_OUT, delay: 0.2 }}
                  className="mb-10"
                >
                  <h1 className="text-[28px] font-semibold tracking-[-0.025em] text-slate-950 leading-tight">
                    Sign in
                  </h1>
                  <p className="mt-2 text-[13.5px] text-slate-400 leading-snug">
                    Use your college-issued credentials to access your portal.
                  </p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.25 }}
                >
                  <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <TabsList className="grid grid-cols-3 w-full h-11 rounded-xl bg-slate-950 p-1 mb-8">
                      {TAB_CONFIG.map(({ value, label, icon: Icon }) => (
                        <TabsTrigger
                          key={value}
                          value={value}
                          className="
                            flex items-center justify-center gap-1.5
                            h-full rounded-lg
                            text-[12px] font-medium text-white/40
                            transition-all duration-150
                            data-[state=active]:bg-white
                            data-[state=active]:text-slate-950
                            data-[state=active]:font-semibold
                            data-[state=active]:shadow-none
                          "
                        >
                          <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={1.75} />
                          {label}
                        </TabsTrigger>
                      ))}
                    </TabsList>

                    <TabsContent value="student" className="mt-0">
                      <StudentLoginForm />
                    </TabsContent>
                    <TabsContent value="staff" className="mt-0">
                      <StaffLoginForm />
                    </TabsContent>
                    <TabsContent value="admin" className="mt-0">
                      <AdminLoginForm />
                    </TabsContent>
                  </Tabs>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.4, ease: EASE_OUT, delay: 0.38 }}
                  className="mt-10 pt-6 border-t border-slate-100 flex items-start gap-2.5"
                >
                  <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-[1px] text-slate-300" strokeWidth={1.75} />
                  <p className="text-[11.5px] leading-relaxed text-slate-400">
                    <span className="font-medium text-slate-600">Notice: </span>
                    Contact IT Support —{" "}
                    <span className="font-medium text-slate-600">Mon–Fri, 10 AM – 5 PM</span>.
                  </p>
                </motion.div>
              </div>
            </div>

            <div className="flex items-center justify-between px-12 xl:px-20 py-5 border-t border-slate-100">
              <p className="text-[11px] text-slate-300">
                © {new Date().getFullYear()} Government Polytechnic Mumbai
              </p>
              <p className="text-[11px] text-slate-300">Railway Concession Portal</p>
            </div>
          </motion.main>
        </div>
      </PageWrapper>
    </div>
  );
};

export default Index;