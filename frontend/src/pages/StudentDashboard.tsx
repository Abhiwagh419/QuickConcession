import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentHeader from "@/components/StudentHeader";
import { apiFetch } from "@/lib/api";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { motion } from "framer-motion";
import {
  Train,
  FileText,
  CreditCard,
  Award,
  Ticket,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
  Globe,
  UserSquare,
  FileDown,
  Landmark,
  ChevronRight,
  HelpCircle,
} from "lucide-react";
import StudentHelpDialog from "@/components/StudentHelpDialog";
import AIChatWidget from "@/components/AIChatWidget";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const fadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: EASE_OUT, delay },
});

function Panel({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 pl-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
      {children}
    </p>
  );
}

function InfoField({
  label,
  value,
}: {
  label: string;
  value: string | number;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-400">
        {label}
      </p>
      <p className="text-sm font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openHelp, setOpenHelp] = useState(false);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const studentData = await apiFetch("/student/me");
        const appsData = await apiFetch("/concession/my");
        setStudent(studentData);
        setApplications(appsData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StudentHeader />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center space-y-2">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-blue-600 border-t-transparent mx-auto" />
            <p className="text-sm text-slate-400">Loading dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-slate-50">
        <StudentHeader />
        <div className="flex h-[60vh] items-center justify-center">
          <Panel className="p-8 text-center max-w-sm">
            <AlertCircle className="mx-auto mb-3 h-8 w-8 text-red-400" />
            <p className="text-sm font-medium text-slate-700">
              {error ?? "No student data found."}
            </p>
          </Panel>
        </div>
      </div>
    );
  }

  const activePass = applications.find(
    (a) =>
      a.status === "ISSUED" &&
      (!a.expiryDate || new Date(a.expiryDate) > new Date()),
  );

  const pendingApp = applications.find((a) => a.status === "PENDING");

  const services = [
    {
      label: "Railway Concession",
      icon: Ticket,
      onClick: () => navigate("/student/railway"),
      description: "Apply for railway concession pass",
    },
    {
      label: "Download Forms",
      icon: FileDown,
      description: "Downloads",
      onClick: () => {
        window.open(
          "https://gpmumbai.ac.in/gpmweb/exam-cell/downloads-qp/",
          "_blank",
          "noopener,noreferrer",
        );
      },
    },
    {
      label: "Fees & Payments",
      icon: Landmark,
      description: "Pay college fees",
      onClick: () => {
        window.open(
          "https://onlinesbi.sbi.bank.in/sbicollect/icollecthome.htm",
          "_blank",
          "noopener,noreferrer",
        );
      },
    },
    {
      label: "Student MIS Portal",
      icon: UserSquare,
      description: "Official MIS Portal",
      onClick: () => {
        window.open(
          "https://lssimss.com/GPMMIS/jsp/userlogin.action",
          "_blank",
          "noopener,noreferrer",
        );
      },
    },
    {
      label: "GPM Website",
      icon: Globe,
      description: "gpmumbai.ac.in",
      onClick: () => {
        window.open(
          "https://gpmumbai.ac.in/gpmweb/",
          "_blank",
          "noopener,noreferrer",
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <StudentHeader />

      <PageWrapper>
        <main className="container mx-auto max-w-6xl space-y-8 px-4 py-8">
          <motion.div
            {...fadeIn(0)}
            className="flex flex-wrap items-start justify-between gap-3"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-black">
                  <Train className="h-4 w-4 text-white" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-slate-800">
                  Student Dashboard
                </h1>
              </div>
              <p className="mt-1 pl-10 text-[13px] text-slate-400">
                Government Polytechnic Mumbai &mdash; Student Portal
              </p>
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={() => setOpenHelp(true)}
              aria-label="Help"
              className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-2 text-[13px] text-slate-500 shadow-sm hover:border-slate-300 hover:text-slate-700"
            >
              <HelpCircle className="h-3.5 w-3.5" />
              Help
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            <div className="space-y-6 lg:col-span-2">
              <motion.div {...fadeIn(0.05)}>
                <SectionLabel>Student Identity</SectionLabel>
                <Panel className="overflow-hidden">
                  <div className="flex items-center gap-3 border-b border-slate-100 px-6 py-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-slate-100">
                      <User className="h-5 w-5 text-black" />
                    </div>
                    <div>
                      <h2 className="text-sm font-semibold text-slate-800">
                        Student Details
                      </h2>
                      <p className="text-[12px] text-slate-400">
                        Enrollment No: {student.enrollmentNo}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-x-8 gap-y-5 px-6 py-5 sm:grid-cols-3">
                    <InfoField label="Full Name" value={student.fullName} />
                    <InfoField label="Course" value={student.course} />
                    <InfoField label="Year" value={student.year} />
                    <InfoField label="Semester" value={student.sem} />
                    <InfoField label="Shift" value={student.shift} />
                    <InfoField
                      label="Enrollment No"
                      value={student.enrollmentNo}
                    />
                  </div>
                </Panel>
              </motion.div>

              <motion.div {...fadeIn(0.1)}>
                <SectionLabel>Railway Concession Status</SectionLabel>

                {activePass ? (
                  <Panel className="overflow-hidden">
                    <div className="flex items-start gap-4 border-l-4 border-emerald-500 px-6 py-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-emerald-50">
                        <CheckCircle className="h-5 w-5 text-emerald-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-slate-800">
                            Active Concession Pass
                          </p>
                          <Badge className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            ISSUED
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {activePass.fromStation}{" "}
                          <span className="mx-1 text-slate-400">→</span>{" "}
                          {activePass.toStation}
                        </p>
                        <p className="mt-1 text-[12px] text-slate-400">
                          Valid until:{" "}
                          <span className="font-medium text-slate-600">
                            {new Date(activePass.expiryDate).toLocaleDateString(
                              "en-IN",
                              {
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                              },
                            )}
                          </span>
                        </p>
                      </div>
                    </div>
                  </Panel>
                ) : pendingApp ? (
                  <Panel className="overflow-hidden">
                    <div className="flex items-start gap-4 border-l-4 border-amber-500 px-6 py-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-amber-50">
                        <Clock className="h-5 w-5 text-amber-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <p className="text-sm font-semibold text-slate-800">
                            Application Under Review
                          </p>
                          <Badge className="bg-amber-100 text-amber-700 border border-amber-200 text-[11px] font-semibold px-2 py-0.5 rounded-full">
                            PENDING
                          </Badge>
                        </div>
                        <p className="text-sm text-slate-600">
                          {pendingApp.fromStation}{" "}
                          <span className="mx-1 text-slate-400">→</span>{" "}
                          {pendingApp.toStation}
                        </p>
                        <p className="mt-1 text-[12px] text-slate-400">
                          Your application is awaiting staff verification.
                        </p>
                      </div>
                    </div>
                  </Panel>
                ) : (
                  <Panel className="overflow-hidden">
                    <div className="flex items-start gap-4 border-l-4 border-slate-300 px-6 py-5">
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-slate-100">
                        <AlertCircle className="h-5 w-5 text-slate-400" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-700 mb-0.5">
                          No Active Concession
                        </p>
                        <p className="text-[12px] text-slate-400 mb-3">
                          You have not applied for a railway concession pass
                          yet.
                        </p>
                        <Button
                          size="sm"
                          onClick={() => navigate("/student/railway")}
                          className="h-8 rounded-lg bg-black px-4 text-[13px] font-semibold text-white hover:bg-slate-900 transition-colors"
                        >
                          Apply Now
                          <ChevronRight className="ml-1 h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </Panel>
                )}
              </motion.div>
            </div>

            <div className="space-y-6">
              <motion.div {...fadeIn(0.15)}>
                <SectionLabel>Student Services</SectionLabel>
                <Panel className="overflow-hidden">
                  <div className="border-b border-slate-100 px-5 py-3.5">
                    <h2 className="text-sm font-semibold text-slate-700">
                      Quick Access
                    </h2>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {services.map((s, i) => (
                      <motion.button
                        key={s.label}
                        onClick={s.onClick}
                        initial={{ opacity: 0, x: 6 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{
                          duration: 0.32,
                          ease: EASE_OUT,
                          delay: 0.18 + i * 0.05,
                        }}
                        className="flex w-full items-center gap-3 px-5 py-3.5 text-left transition-colors duration-150 hover:bg-slate-100 group"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-100 group-hover:bg-blue-100 transition-colors duration-150">
                          <s.icon className="h-4 w-4 text-slate-500 group-hover:text-black transition-colors duration-150" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-[13px] font-semibold text-slate-700 group-hover:text-blue-700 truncate">
                            {s.label}
                          </p>
                          <p className="text-[11px] text-slate-400 truncate">
                            {s.description}
                          </p>
                        </div>
                        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300 group-hover:text-blue-400 transition-colors duration-150" />
                      </motion.button>
                    ))}
                  </div>
                </Panel>
              </motion.div>
            </div>

            <motion.div {...fadeIn(0.3)} className="col-span-1 lg:col-span-3">
              <div className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-100 px-5 py-4">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-slate-500" />
                <p className="text-[13px] text-slate-800 leading-relaxed">
                  <span className="font-semibold">Notice:</span> For any issues
                  with the portal, please contact the IT Department during
                  office hours{" "}
                  <span className="font-medium">(10 AM – 5 PM)</span>.
                </p>
              </div>
            </motion.div>
          </div>
        </main>
      </PageWrapper>

      <StudentHelpDialog
        open={openHelp}
        onOpenChange={setOpenHelp}
        enrollmentNo={student.enrollmentNo}
      />

      <AIChatWidget role="student" />
    </div>
  );
};

export default StudentDashboard;
