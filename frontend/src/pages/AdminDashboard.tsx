import { useEffect, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import AdminHeader from "@/components/AdminHeader";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import {
  Users,
  UserCog,
  FileText,
  Clock,
  Settings,
  BarChart3,
  ShieldCheck,
  AlertCircle,
  Activity,
  TrendingUp,
  Wifi,
  Server,
  RefreshCw,
  ArrowRight,
  CheckCircle2,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";

// ─── Types ────────────────────────────────────────────────────────────────────

interface DashboardStats {
  totalStudents: number;
  totalStaff: number;
  totalApplications: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

// ─── Animation helpers ────────────────────────────────────────────────────────

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const fadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: EASE_OUT, delay },
});

// ─── Primitives ───────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 pl-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-slate-400">
      {children}
    </p>
  );
}

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

function InlineDivider() {
  return <div className="my-4 h-px w-full bg-slate-100" />;
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  label,
  value,
  icon,
  iconBg,
  loading,
  delay,
}: {
  label: string;
  value: number;
  icon: React.ReactNode;
  iconBg: string;
  loading: boolean;
  delay: number;
}) {
  return (
    <motion.div {...fadeIn(delay)}>
      <Panel className="flex items-start gap-4 p-5 transition-shadow duration-200 hover:shadow-md">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
        >
          {icon}
        </div>
        <div className="min-w-0">
          <p className="truncate text-[11px] font-semibold uppercase tracking-widest text-slate-400">
            {label}
          </p>
          {loading ? (
            <div className="mt-1.5 h-7 w-16 animate-pulse rounded bg-slate-100" />
          ) : (
            <p
              className="mt-0.5 text-3xl font-semibold
 tabular-nums text-slate-800"
            >
              {value.toLocaleString()}
            </p>
          )}
        </div>
      </Panel>
    </motion.div>
  );
}

// ─── Status Bar ───────────────────────────────────────────────────────────────

function StatusBar({
  label,
  count,
  total,
  barClass,
  trackClass,
  animDelay,
}: {
  label: string;
  count: number;
  total: number;
  barClass: string;
  trackClass: string;
  animDelay: number;
}) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0;
  return (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-xs">
        <span className="font-medium text-slate-600">{label}</span>
        <span className="tabular-nums text-slate-500">
          {count} <span className="text-slate-400">({pct}%)</span>
        </span>
      </div>
      <div className={`h-2 w-full overflow-hidden rounded-full ${trackClass}`}>
        <motion.div
          className={`h-full rounded-full ${barClass}`}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.85, ease: EASE_OUT, delay: animDelay }}
        />
      </div>
    </div>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusBadge({
  label,
  variant,
  pulse = false,
}: {
  label: string;
  variant: "success" | "warning" | "neutral";
  pulse?: boolean;
}) {
  const cls = {
    success: "bg-emerald-50 border-emerald-200 text-emerald-700",
    warning: "bg-amber-50 border-amber-200 text-amber-700",
    neutral: "bg-slate-100 border-slate-200 text-slate-500",
  }[variant];

  const dot = {
    success: "bg-emerald-500",
    warning: "bg-amber-500",
    neutral: "bg-slate-400",
  }[variant];

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cls}`}
    >
      <span
        className={`h-1.5 w-1.5 shrink-0 rounded-full ${dot} ${
          pulse ? "animate-pulse" : ""
        }`}
      />
      {label}
    </span>
  );
}

// ─── Health Row ───────────────────────────────────────────────────────────────

function HealthRow({
  icon,
  label,
  right,
}: {
  icon: React.ReactNode;
  label: string;
  right: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-2.5 last:border-0">
      <div className="flex items-center gap-2.5">
        <span className="text-slate-400">{icon}</span>
        <span className="text-sm text-slate-600">{label}</span>
      </div>
      <div>{right}</div>
    </div>
  );
}

// ─── Module Card ──────────────────────────────────────────────────────────────

function ModuleCard({
  title,
  description,
  icon,
  iconBg,
  route,
  buttonLabel,
  delay,
}: {
  title: string;
  description: string;
  icon: React.ReactNode;
  iconBg: string;
  route: string;
  buttonLabel: string;
  delay: number;
}) {
  const navigate = useNavigate();
  return (
    <motion.div {...fadeIn(delay)} className="h-full">
      <Panel className="flex h-full flex-col gap-4 p-5 transition-shadow duration-200 hover:shadow-md">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${iconBg}`}
          >
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
            <p className="mt-0.5 text-[12px] leading-relaxed text-slate-400">
              {description}
            </p>
          </div>
        </div>
        <Button
          onClick={() => navigate(route)}
          variant="outline"
          className="group mt-auto flex h-9 w-full items-center justify-center gap-1.5 rounded-lg border-blue-200 text-sm font-semibold text-blue-700 transition-all duration-200 hover:border-blue-600 hover:bg-blue-600 hover:text-white"
        >
          {buttonLabel}
          <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
        </Button>
      </Panel>
    </motion.div>
  );
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalStaff: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshed, setLastRefreshed] = useState<Date>(new Date());

  const fetchStats = async () => {
    setRefreshing(true);
    try {
      const data = await apiFetch("/admin/dashboard");
      setStats(data);
    } catch (err) {
      console.error("Failed to load dashboard stats:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
      setLastRefreshed(new Date());
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const approvalRate =
    stats.totalApplications > 0
      ? Math.round((stats.approvedApplications / stats.totalApplications) * 100)
      : 0;

  return (
    <div className="min-h-screen bg-slate-50">
      <AdminHeader />

      <PageWrapper>
        <main className="container mx-auto max-w-7xl space-y-8 px-4 py-8">
          {/* ── Page Header ─────────────────────────────────────────── */}
          <motion.div
            {...fadeIn(0)}
            className="flex flex-wrap items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
                  <ShieldCheck className="h-4 w-4 text-white" />
                </div>
                <h1
                  className="text-3xl font-semibold
 tracking-tight text-slate-900"
                >
                  Admin Dashboard
                </h1>
              </div>
              <p className="mt-1 pl-10 text-[13px] text-slate-400">
                QuickConcession &mdash; Government
                Polytechnic Institute
              </p>
            </div>

            <button
              onClick={fetchStats}
              disabled={refreshing}
              className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] text-slate-500 shadow-sm transition-all duration-200 hover:border-slate-300 hover:text-slate-700 disabled:opacity-50"
            >
              <RefreshCw
                className={`h-3.5 w-3.5 ${
                  refreshing ? "animate-spin text-blue-500" : ""
                }`}
              />
              Refreshed at{" "}
              {lastRefreshed.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </button>
          </motion.div>

          {/* ── Overview Stats ──────────────────────────────────────── */}
          <div>
            <SectionLabel>Overview</SectionLabel>
            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              <StatCard
                label="Total Students"
                value={stats.totalStudents}
                icon={<Users className="h-5 w-5 text-blue-600" />}
                iconBg="bg-blue-50"
                loading={loading}
                delay={0.05}
              />
              <StatCard
                label="Total Staff"
                value={stats.totalStaff}
                icon={<UserCog className="h-5 w-5 text-indigo-600" />}
                iconBg="bg-indigo-50"
                loading={loading}
                delay={0.1}
              />
              <StatCard
                label="Total Applications"
                value={stats.totalApplications}
                icon={<FileText className="h-5 w-5 text-slate-500" />}
                iconBg="bg-slate-100"
                loading={loading}
                delay={0.15}
              />
              <StatCard
                label="Pending Review"
                value={stats.pendingApplications}
                icon={<Clock className="h-5 w-5 text-amber-600" />}
                iconBg="bg-amber-50"
                loading={loading}
                delay={0.2}
              />
            </div>
          </div>

          {/* ── Analytics ───────────────────────────────────────────── */}
          <div>
            <SectionLabel>Application Analytics</SectionLabel>
            <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
              {/* Status Breakdown */}
              <motion.div {...fadeIn(0.25)} className="lg:col-span-2">
                <Panel className="h-full p-6">
                  <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <BarChart3 className="h-4 w-4 text-blue-600" />
                      <h2 className="text-sm font-semibold text-slate-700">
                        Application Status Breakdown
                      </h2>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-emerald-700">
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Approved / Issued / Expired:{" "}
                        {stats.approvedApplications}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-amber-600">
                        <Clock className="h-3.5 w-3.5" />
                        Pending: {stats.pendingApplications}
                      </span>
                      <span className="text-slate-300">|</span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] font-medium text-red-500">
                        <XCircle className="h-3.5 w-3.5" />
                        Rejected: {stats.rejectedApplications}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-5">
                    <StatusBar
                      label="Approved / Issued / Expired"
                      count={stats.approvedApplications}
                      total={stats.totalApplications}
                      barClass="bg-emerald-500"
                      trackClass="bg-emerald-50"
                      animDelay={0.3}
                    />
                    <StatusBar
                      label="Pending Review"
                      count={stats.pendingApplications}
                      total={stats.totalApplications}
                      barClass="bg-amber-500"
                      trackClass="bg-amber-50"
                      animDelay={0.38}
                    />
                    <StatusBar
                      label="Rejected"
                      count={stats.rejectedApplications}
                      total={stats.totalApplications}
                      barClass="bg-red-400"
                      trackClass="bg-red-50"
                      animDelay={0.46}
                    />
                  </div>

                  <InlineDivider />

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-[13px] text-slate-500">
                      <TrendingUp className="h-4 w-4 text-emerald-600" />
                      Overall Approval Performance:{" "}
                      <span className="font-semibold text-emerald-700">
                        {approvalRate}%
                      </span>
                    </div>
                    <button
                      onClick={() => navigate("/admin/applications")}
                      className="flex items-center gap-1 text-[12px] font-medium text-blue-600 transition-colors hover:text-blue-700"
                    >
                      View all applications
                      <ChevronRight className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </Panel>
              </motion.div>

              {/* Security & Health */}
              <motion.div {...fadeIn(0.3)}>
                <Panel className="h-full p-6">
                  <div className="mb-4 flex items-center gap-2">
                    <ShieldCheck className="h-4 w-4 text-blue-600" />
                    <h2 className="text-sm font-semibold text-slate-700">
                      Security &amp; System Health
                    </h2>
                  </div>

                  <div>
                    <HealthRow
                      icon={<Activity className="h-4 w-4" />}
                      label="Last Admin Login"
                      right={
                        <span className="tabular-nums text-[12px] text-slate-500">
                          Session Active
                        </span>
                      }
                    />
                    <HealthRow
                      icon={<Server className="h-4 w-4" />}
                      label="System Status"
                      right={
                        <StatusBadge
                          label="Operational"
                          variant="success"
                          pulse
                        />
                      }
                    />
                    <HealthRow
                      icon={<Wifi className="h-4 w-4" />}
                      label="Application Window"
                      right={
                        <StatusBadge label="Open" variant="warning" pulse />
                      }
                    />
                    <HealthRow
                      icon={<FileText className="h-4 w-4" />}
                      label="Pending Actions"
                      right={
                        <StatusBadge
                          label={`${stats.pendingApplications} pending`}
                          variant={
                            stats.pendingApplications > 0
                              ? "warning"
                              : "neutral"
                          }
                        />
                      }
                    />
                  </div>

                  {stats.pendingApplications > 0 && (
                    <div className="mt-4 flex items-start gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-3">
                      <AlertCircle className="h-4 w-4 shrink-0 mt-0.5 text-amber-600" />
                      <p className="text-[12px] leading-relaxed text-amber-700">
                        <span className="font-semibold">
                          {stats.pendingApplications} application
                          {stats.pendingApplications !== 1 ? "s" : ""}
                        </span>{" "}
                        require administrative review before processing.
                      </p>
                    </div>
                  )}
                </Panel>
              </motion.div>
            </div>
          </div>

          {/* ── Management Modules ───────────────────────────────────── */}
          <div>
            <SectionLabel>Management Modules</SectionLabel>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <ModuleCard
                title="Student Management"
                description="View, verify, and manage registered student records."
                icon={<Users className="h-5 w-5 text-blue-600" />}
                iconBg="bg-blue-50"
                route="/admin/students"
                buttonLabel="Manage Students"
                delay={0.35}
              />
              <ModuleCard
                title="Staff Management"
                description="Configure staff accounts, roles, and access permissions."
                icon={<UserCog className="h-5 w-5 text-indigo-600" />}
                iconBg="bg-indigo-50"
                route="/admin/staff"
                buttonLabel="Manage Staff"
                delay={0.4}
              />
              <ModuleCard
                title="Application Oversight"
                description="Review, approve, or reject student concession applications."
                icon={<FileText className="h-5 w-5 text-slate-500" />}
                iconBg="bg-slate-100"
                route="/admin/applications"
                buttonLabel="View Applications"
                delay={0.45}
              />
              <ModuleCard
                title="System Controls"
                description="Configure system parameters, application windows, and settings."
                icon={<Settings className="h-5 w-5 text-slate-500" />}
                iconBg="bg-slate-100"
                route="/admin/settings"
                buttonLabel="Configure System"
                delay={0.5}
              />
            </div>
          </div>

          {/* ── Footer ──────────────────────────────────────────────── */}
          <motion.div
            {...fadeIn(0.6)}
            className="flex items-center gap-3 pb-6 pt-2"
          >
            <div className="h-px flex-1 bg-slate-200" />
            <p className="whitespace-nowrap px-3 text-[11px] text-slate-400">
              QuickConcession &mdash; Government
              Polytechnic Institute &mdash; Admin Portal
            </p>
            <div className="h-px flex-1 bg-slate-200" />
          </motion.div>
        </main>
      </PageWrapper>
    </div>
  );
};

export default AdminDashboard;
