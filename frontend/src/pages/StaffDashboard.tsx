import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Train, FileText, Award, HelpCircle, User, Globe, Landmark, School } from "lucide-react";
import StaffHeader from "@/components/StaffHeader";
import { useEffect, useState } from "react";
import { getStaffApplications } from "../api/staffConcessions";
import PageWrapper from "@/components/PageWrapper";
import { apiFetch } from "@/lib/api";
import { motion } from "framer-motion";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  MapPin,
  ChevronRight,
  Download,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
} from "lucide-react";

// ─── Animation helpers ────────────────────────────────────────────────────────

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const fadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: EASE_OUT, delay },
});

// ─── Section Label ────────────────────────────────────────────────────────────

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="mb-3 pl-0.5 text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground">
      {children}
    </p>
  );
}

// ─── Info Field ───────────────────────────────────────────────────────────────

function InfoField({ label, value }: { label: string; value?: string | number }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatTile({
  label,
  value,
  colorClass,
}: {
  label: string;
  value: number;
  colorClass: string;
}) {
  return (
    <Card className="border shadow-sm hover:shadow-md transition-shadow duration-200">
      <CardContent className="p-5">
        <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground mb-1">
          {label}
        </p>
        <p className={`text-3xl font-bold tabular-nums ${colorClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}

// ─── Status Badge ─────────────────────────────────────────────────────────────

function StatusChip({ status }: { status: string }) {
  const map: Record<string, string> = {
    ISSUED:   "bg-success/10 text-success border-success/30",
    APPROVED: "bg-success/10 text-success border-success/30",
    EXPIRED:  "bg-warning/10 text-warning border-warning/30",
    PENDING:  "bg-primary/10 text-primary border-primary/30",
    REJECTED: "bg-destructive/10 text-destructive border-destructive/30",
  };
  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${
        map[status] ?? "bg-muted text-muted-foreground border-border"
      }`}
    >
      {status}
    </span>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const StaffDashboard = () => {
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsError, setDetailsError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("staffToken");
  const [enrollmentNo, setEnrollmentNo] = useState("");
  const [history, setHistory] = useState<any[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState<string | null>(null);
  const [historyFilter, setHistoryFilter] = useState<
    "ALL" | "PENDING" | "APPROVED" | "EXPIRED" | "REJECTED"
  >("ALL");

  const staffInfo = token ? jwtDecode<any>(token) : null;
  const [openStudentDialog, setOpenStudentDialog] = useState(false);
  const [openHistoryPanel, setOpenHistoryPanel] = useState(false);
  const [studentSummary, setStudentSummary] = useState<any | null>(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

  const openApplicationDetails = async (id: number) => {
    setOpenDetails(true);
    setDetailsLoading(true);
    try {
      const data = await apiFetch(`/staff/concessions/${id}`);
      setSelectedApp(data);
    } finally {
      setDetailsLoading(false);
    }
  };

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getStaffApplications();
        setApplications(data);
      } catch (err) {
        console.error("Failed to fetch applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const handleSearchStudent = async () => {
    if (!enrollmentNo.trim()) return;
    if (enrollmentNo.trim().length < 9) return;
    setSummaryLoading(true);
    setStudentSummary(null);
    try {
      const data = await apiFetch(`/staff/students/${enrollmentNo}/summary`);
      setStudentSummary(data);
      setOpenStudentDialog(true);
    } catch {
      setStudentSummary(null);
      setOpenStudentDialog(false);
    } finally {
      setSummaryLoading(false);
    }
  };

  const fetchHistory = async () => {
    if (!enrollmentNo.trim()) return;
    setHistory([]);
    setSelectedApp(null);
    setHistoryError(null);
    setHistoryLoading(true);
    try {
      const data = await apiFetch(`/staff/applications/by-enrollment/${enrollmentNo}`);
      setHistory(data);
    } catch (err: any) {
      setHistoryError(err.message || "Failed to fetch history");
    } finally {
      setHistoryLoading(false);
    }
  };

  const exportExcel = async (range?: string, from?: string, to?: string) => {
    try {
      const token = localStorage.getItem("staffToken");
      if (!token) { alert("Not authenticated"); return; }
      let url = `http://localhost:4000/staff/concessions/export`;
      const params = new URLSearchParams();
      if (range) params.append("range", range);
      if (from && to) { params.append("from", from); params.append("to", to); }
      const response = await fetch(`${url}?${params.toString()}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) throw new Error("Failed to export");
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = downloadUrl;
      a.download = "concessions-export.xlsx";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error(err);
      alert("Failed to export Excel");
    }
  };

  useEffect(() => {
    if (!enrollmentNo.trim()) { setHistory([]); setSelectedApp(null); return; }
    const debounceTimer = setTimeout(() => { handleSearchStudent(); }, 500);
    return () => clearTimeout(debounceTimer);
  }, [enrollmentNo]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StaffHeader />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center space-y-2">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading dashboard…</p>
          </div>
        </div>
      </div>
    );
  }

  const pendingCount  = applications.filter((a) => a.status === "PENDING").length;
  const approvedCount = applications.filter((a) => a.status === "APPROVED").length;
  const rejectedCount = applications.filter((a) => a.status === "REJECTED").length;
  const issuedCount   = applications.filter((a) => a.status === "ISSUED" || a.status === "EXPIRED").length;

  const adminModules = [
    {
      label: "Railway Concession Management",
      icon: Train,
      type: "internal",
      path: "/staff/railway",
      description: "Process student concession applications",
      badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
    },
    {
      label: "Institute Website",
      icon: Landmark,
      type: "external",
      url: "https://gpmumbai.ac.in/gpmweb/",
      description: "Official Government Polytechnic Mumbai portal",
    },
    {
      label: "MSBTE Portal",
      icon: School,
      type: "external",
      url: "https://msbte.ac.in/",
      description: "Board circulars, exam schedules, results",
    },
    {
      label: "Scholarship Portal",
      icon: GraduationCap,
      type: "external",
      url: "https://mahadbt.maharashtra.gov.in/Home/Index",
      description: "Government scholarships & DBT status",
    },
  ];

  const filteredHistory =
    historyFilter === "ALL" ? history : history.filter((app) => app.status === historyFilter);

  const exportRanges = [
    { label: "Last 1 Day",    range: "1d" },
    { label: "Last 3 Days",   range: "3d" },
    { label: "Last 1 Month",  range: "1m" },
    { label: "Last 6 Months", range: "6m" },
  ];

  const filterOptions: Array<"ALL" | "PENDING" | "APPROVED" | "EXPIRED" | "REJECTED"> = [
    "ALL", "PENDING", "APPROVED", "EXPIRED", "REJECTED",
  ];

  return (
    <div className="min-h-screen bg-background">
      <StaffHeader />

      <PageWrapper>
        <main className="container mx-auto max-w-6xl space-y-8 px-4 py-8">

          {/* ── Page Header ──────────────────────────────────────────── */}
          <motion.div {...fadeIn(0)} className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Staff Dashboard
                </h1>
              </div>
              <p className="mt-1 pl-10 text-[13px] text-muted-foreground">
                Government Polytechnic Mumbai &mdash; Staff Portal
              </p>
            </div>
          </motion.div>

          {/* ── Staff Profile ────────────────────────────────────────── */}
          <motion.div {...fadeIn(0.05)}>
            <SectionLabel>Staff Identity</SectionLabel>
            <Card className="border shadow-sm overflow-hidden">
              <div className="flex items-center gap-3 border-b bg-muted/30 px-6 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-foreground">
                    {staffInfo?.name ?? "Staff Member"}
                  </h2>
                  <p className="text-[12px] text-muted-foreground">
                    {staffInfo?.role ?? "Staff"}
                  </p>
                </div>
              </div>
              <CardContent className="grid grid-cols-2 gap-x-8 gap-y-5 px-6 py-5 sm:grid-cols-4">
                <InfoField label="Full Name"  value={staffInfo?.name} />
                <InfoField label="Staff ID"   value={staffInfo?.staffId} />
                <InfoField label="Email"      value={staffInfo?.email} />
                <InfoField label="Role"       value={staffInfo?.role} />
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Quick Stats ──────────────────────────────────────────── */}
          <motion.div {...fadeIn(0.1)}>
            <SectionLabel>Application Overview</SectionLabel>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
              <StatTile label="Pending"  value={pendingCount}  colorClass="text-warning" />
              <StatTile label="Approved" value={approvedCount} colorClass="text-success" />
              <StatTile label="Rejected" value={rejectedCount} colorClass="text-destructive" />
              <StatTile label="Issued"   value={issuedCount}   colorClass="text-primary" />
            </div>
          </motion.div>

          {/* ── Export Concession Records ─────────────────────────────── */}
          <motion.div {...fadeIn(0.15)}>
            <SectionLabel>Export Records</SectionLabel>
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Download className="h-4 w-4 text-primary" />
                  Export Concession Records
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="flex flex-wrap gap-3">
                  {exportRanges.map((r) => (
                    <Button
                      key={r.range}
                      variant="outline"
                      size="sm"
                      onClick={() => exportExcel(r.range)}
                      className="h-9 rounded-lg border-border text-sm font-medium text-foreground hover:bg-muted hover:border-primary/40 transition-all duration-150"
                    >
                      {r.label}
                    </Button>
                  ))}
                </div>
                <p className="mt-3 text-[12px] text-muted-foreground">
                  Downloads an Excel file containing concession records for the selected period.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Student Lookup ───────────────────────────────────────── */}
          <motion.div {...fadeIn(0.2)}>
            <SectionLabel>Student Lookup</SectionLabel>
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <Search className="h-4 w-4 text-primary" />
                  Student Lookup
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <div className="flex items-center gap-3 max-w-sm">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <input
                      className="w-full rounded-lg border border-border bg-background pl-9 pr-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/30 transition-all duration-150"
                      placeholder="Enter Enrollment Number"
                      value={enrollmentNo}
                      onChange={(e) => setEnrollmentNo(e.target.value.toUpperCase())}
                    />
                  </div>
                  {summaryLoading && (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  )}
                </div>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  Enter a student enrollment number to view their profile and application history.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Student Summary Dialog ────────────────────────────────── */}
          <Dialog open={openStudentDialog} onOpenChange={setOpenStudentDialog}>
            <DialogContent className="max-w-xl">
              <DialogHeader>
                <DialogTitle>Student Summary</DialogTitle>
              </DialogHeader>

              {summaryLoading && (
                <div className="flex items-center gap-2 py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Loading summary…</p>
                </div>
              )}

              {studentSummary && (
                <div className="space-y-5">
                  {/* Identity */}
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <User className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-foreground">
                        {studentSummary.student.fullName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {studentSummary.student.enrollmentNo}
                      </p>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4">
                    <InfoField label="Course"   value={studentSummary.student.course} />
                    <InfoField label="Year"     value={studentSummary.student.year} />
                    <InfoField label="Semester" value={studentSummary.student.sem} />
                    <InfoField label="Shift"    value={studentSummary.student.shift} />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                      {studentSummary.student.email}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                      {studentSummary.student.mobileNumber}
                    </div>
                    {studentSummary.student.dateOfBirth && (
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                        {new Date(studentSummary.student.dateOfBirth).toLocaleDateString("en-IN")}
                      </div>
                    )}
                    {studentSummary.student.address && (
                      <div className="flex items-start gap-2 text-sm text-foreground">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                        {studentSummary.student.address}
                      </div>
                    )}
                  </div>

                  <Separator />

                  {/* Stats */}
                  <div className="grid grid-cols-4 gap-3">
                    <div className="rounded-lg border border-warning/30 bg-warning/10 p-3 text-center">
                      <p className="text-[11px] font-semibold uppercase text-warning">Pending</p>
                      <p className="text-xl font-bold text-warning">{studentSummary.stats.pending}</p>
                    </div>
                    <div className="rounded-lg border border-success/30 bg-success/10 p-3 text-center">
                      <p className="text-[11px] font-semibold uppercase text-success">Issued</p>
                      <p className="text-xl font-bold text-success">{studentSummary.stats.issued}</p>
                    </div>
                    <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-center">
                      <p className="text-[11px] font-semibold uppercase text-destructive">Rejected</p>
                      <p className="text-xl font-bold text-destructive">{studentSummary.stats.rejected}</p>
                    </div>
                    <div className="rounded-lg border border-border bg-muted p-3 text-center">
                      <p className="text-[11px] font-semibold uppercase text-muted-foreground">Total</p>
                      <p className="text-xl font-bold text-foreground">{studentSummary.stats.total}</p>
                    </div>
                  </div>

                  <Separator />

                  {/* Latest Application */}
                  {studentSummary.latest ? (
                    <div className="rounded-lg border border-border bg-muted/30 p-4 space-y-1.5">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                        Latest Application
                      </p>
                      <div className="flex items-center gap-2">
                        <StatusChip status={studentSummary.latest.status} />
                      </div>
                      <p className="text-sm text-foreground">
                        {studentSummary.latest.fromStation}{" "}
                        <span className="text-muted-foreground mx-1">→</span>{" "}
                        {studentSummary.latest.toStation}
                      </p>
                      <p className="text-[12px] text-muted-foreground">
                        Applied:{" "}
                        {new Date(studentSummary.latest.appliedAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      No applications found for this student.
                    </p>
                  )}

                  <Button
                    className="w-full focus-visible:ring-0 focus-visible:ring-offset-0"
                    onClick={() => {
                      setOpenStudentDialog(false);
                      setOpenHistoryPanel(true);
                      fetchHistory();
                    }}
                  >
                    View Full Application History
                    <ChevronRight className="ml-1.5 h-4 w-4" />
                  </Button>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* ── History Dialog ────────────────────────────────────────── */}
          <Dialog
            open={openHistoryPanel}
            onOpenChange={(open) => {
              setOpenHistoryPanel(open);
              if (open) setHistoryFilter("ALL");
            }}
          >
            <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Application History</DialogTitle>
              </DialogHeader>

              {/* Filter Buttons */}
              <div className="flex flex-wrap gap-2 mb-2">
                {filterOptions.map((f) => (
                  <Button
                    key={f}
                    size="sm"
                    variant={historyFilter === f ? "default" : "outline"}
                    onClick={() => setHistoryFilter(f)}
                    className="h-8 rounded-full text-xs font-semibold px-3"
                  >
                    {f}
                  </Button>
                ))}
              </div>

              <Separator className="mb-3" />

              {historyLoading && (
                <div className="flex items-center gap-2 py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Loading history…</p>
                </div>
              )}

              {historyError && (
                <p className="text-sm text-destructive">{historyError}</p>
              )}

              <div className="space-y-2">
                {filteredHistory.map((app) => (
                  <div
                    key={app.id}
                    onClick={() => {
                      if (app.status === "PENDING") {
                        navigate(`/staff/railway/process/${app.id}`);
                      } else {
                        openApplicationDetails(app.id);
                      }
                    }}
                    className="flex items-center justify-between rounded-xl border border-border bg-background px-4 py-3 cursor-pointer transition-all duration-150 hover:bg-muted/50 hover:shadow-sm"
                  >
                    <div className="space-y-0.5">
                      <p className="text-sm font-medium text-foreground">
                        {app.fromStation}
                        <span className="mx-1.5 text-muted-foreground">→</span>
                        {app.toStation}
                      </p>
                      <p className="text-[11px] text-muted-foreground">
                        {new Date(app.appliedAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusChip status={app.status} />
                      <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                    </div>
                  </div>
                ))}

                {!historyLoading && filteredHistory.length === 0 && (
                  <p className="py-6 text-center text-sm text-muted-foreground">
                    No applications found for this filter.
                  </p>
                )}
              </div>
            </DialogContent>
          </Dialog>

          {/* ── Application Details Modal ─────────────────────────────── */}
          <Dialog open={openDetails} onOpenChange={setOpenDetails}>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Concession Application Details</DialogTitle>
              </DialogHeader>

              {detailsLoading && (
                <div className="flex items-center gap-2 py-4">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                  <p className="text-sm text-muted-foreground">Loading details…</p>
                </div>
              )}

              {detailsError && (
                <p className="text-sm text-destructive">{detailsError}</p>
              )}

              {selectedApp && (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                  {/* Student Profile */}
                  <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">Student Details</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <InfoField label="Full Name"   value={selectedApp.student.fullName} />
                      <InfoField label="Enrollment"  value={selectedApp.student.enrollmentNo} />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <GraduationCap className="h-3.5 w-3.5 text-muted-foreground" />
                        {selectedApp.student.course} &mdash; Sem {selectedApp.student.sem}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Mail className="h-3.5 w-3.5 text-muted-foreground" />
                        {selectedApp.student.email}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-foreground">
                        <Phone className="h-3.5 w-3.5 text-muted-foreground" />
                        {selectedApp.student.mobileNumber}
                      </div>
                      <div className="flex items-start gap-2 text-sm text-foreground">
                        <MapPin className="h-3.5 w-3.5 mt-0.5 text-muted-foreground shrink-0" />
                        {selectedApp.student.address}
                      </div>
                    </div>
                  </div>

                  {/* Application Details */}
                  <div className="rounded-xl border border-border bg-muted/30 p-5 space-y-4">
                    <div className="flex items-center gap-2">
                      <Train className="h-4 w-4 text-primary" />
                      <h3 className="text-sm font-semibold text-foreground">Application Details</h3>
                    </div>
                    <div className="grid grid-cols-1 gap-3">
                      <div className="space-y-0.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Status</p>
                        <StatusChip status={selectedApp.status} />
                      </div>
                      <InfoField label="Duration" value={selectedApp.duration} />
                      <InfoField label="Class"    value={selectedApp.travelClass} />
                    </div>
                    <Separator />
                    <div className="space-y-2">
                      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">Route</p>
                      <p className="text-sm font-medium text-foreground">
                        {selectedApp.fromStation}
                        <span className="mx-1.5 text-muted-foreground">→</span>
                        {selectedApp.toStation}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-3.5 w-3.5" />
                      Applied on{" "}
                      {new Date(selectedApp.appliedAt).toLocaleDateString("en-IN")}
                    </div>

                    {selectedApp.status === "REJECTED" && (
                      <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-3 space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-destructive">
                          Rejection Details
                        </p>
                        <p className="text-sm text-foreground">
                          <span className="text-muted-foreground">On: </span>
                          {new Date(selectedApp.rejectedAt).toLocaleDateString("en-IN")}
                        </p>
                        <p className="text-sm text-foreground">
                          <span className="text-muted-foreground">Reason: </span>
                          {selectedApp.rejectionReason}
                        </p>
                      </div>
                    )}

                    {(selectedApp.status === "ISSUED" || selectedApp.status === "EXPIRED") && (
                      <div className="rounded-lg border border-success/30 bg-success/5 p-3 space-y-1">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-success">
                          Pass Details
                        </p>
                        <p className="text-sm text-foreground">
                          <span className="text-muted-foreground">Pass No: </span>
                          {selectedApp.concessionNumber}
                        </p>
                        <p className="text-sm text-foreground">
                          <span className="text-muted-foreground">
                            {selectedApp.status === "EXPIRED" ? "Expired On" : "Expires On"}:{" "}
                          </span>
                          {new Date(selectedApp.expiryDate).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* ── Help & Support ───────────────────────────────────────── */}
          <motion.div {...fadeIn(0.25)}>
            <SectionLabel>Support</SectionLabel>
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/20">
                <CardTitle className="flex items-center gap-2 text-base font-semibold">
                  <HelpCircle className="h-4 w-4 text-primary" />
                  Help &amp; Support
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-5">
                <Button
                  onClick={() => navigate("/staff/chat")}
                  variant="outline"
                  className="flex items-center gap-2 rounded-lg border-border text-sm font-semibold hover:bg-muted hover:border-primary/40 transition-all duration-150"
                >
                  <FileText className="h-4 w-4" />
                  Help &amp; Student Chats
                </Button>
                <p className="mt-2 text-[12px] text-muted-foreground">
                  View and respond to student queries in real time.
                </p>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Administrative Modules ───────────────────────────────── */}
          <motion.div {...fadeIn(0.3)}>
            <SectionLabel>Administrative Modules</SectionLabel>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              {adminModules.map((module, i) => (
                <motion.div
                  key={module.label}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.32, ease: EASE_OUT, delay: 0.33 + i * 0.05 }}
                >
                  <button
                    onClick={() => {
                      if (module.type === "internal") {
                        navigate(module.path!);
                      } else {
                        window.open(module.url, "_blank", "noopener,noreferrer");
                      }
                    }}
                    className="group flex w-full items-start gap-4 rounded-xl border border-border bg-card p-5 text-left shadow-sm transition-all duration-200 hover:border-primary/30 hover:shadow-md"
                  >
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-primary/10 group-hover:bg-primary/15 transition-colors duration-150">
                      <module.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <p className="text-sm font-semibold text-foreground group-hover:text-primary transition-colors duration-150">
                          {module.label}
                        </p>
                        {module.badge && (
                          <span className="rounded-full border border-warning/30 bg-warning/10 px-2 py-0.5 text-[11px] font-semibold text-warning">
                            {module.badge}
                          </span>
                        )}
                      </div>
                      <p className="mt-0.5 text-[12px] leading-relaxed text-muted-foreground">
                        {module.description}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary transition-colors duration-150 mt-0.5" />
                  </button>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── Footer ───────────────────────────────────────────────── */}
          <motion.div
            {...fadeIn(0.45)}
            className="flex items-center gap-3 pb-6 pt-2"
          >
            <div className="h-px flex-1 bg-border" />
            <p className="whitespace-nowrap px-3 text-[11px] text-muted-foreground">
              Railway Concession Management System &mdash; Government Polytechnic Mumbai &mdash; Staff Portal
            </p>
            <div className="h-px flex-1 bg-border" />
          </motion.div>

        </main>
      </PageWrapper>
    </div>
  );
};

export default StaffDashboard;