import { useEffect, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import AdminHeader from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  FileText,
  Train,
  User,
  ArrowRight,
  Clock,
  CheckCircle,
  XCircle,
  FileCheck,
  AlertTriangle,
  Calendar,
  Hash,
  MapPin,
} from "lucide-react";
import { apiFetch } from "@/lib/api";
import { motion, AnimatePresence } from "framer-motion";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const fadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: EASE_OUT, delay },
});

const STATUS_CONFIG: Record<
  string,
  {
    badge: string;
    header: string;
    dot: string;
    icon: React.ReactNode;
    label: string;
  }
> = {
  PENDING: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    header: "bg-amber-50 border-amber-200",
    dot: "bg-amber-400",
    icon: <Clock className="h-3.5 w-3.5" />,
    label: "Pending Review",
  },
  SUBMITTED: {
    badge: "bg-amber-50 text-amber-700 border-amber-200",
    header: "bg-amber-50 border-amber-200",
    dot: "bg-amber-400",
    icon: <Clock className="h-3.5 w-3.5" />,
    label: "Submitted",
  },
  APPROVED: {
    badge: "bg-emerald-50 text-emerald-700 border-emerald-200",
    header: "bg-emerald-50 border-emerald-200",
    dot: "bg-emerald-500",
    icon: <CheckCircle className="h-3.5 w-3.5" />,
    label: "Approved",
  },
  REJECTED: {
    badge: "bg-red-50 text-red-700 border-red-200",
    header: "bg-red-50 border-red-200",
    dot: "bg-red-500",
    icon: <XCircle className="h-3.5 w-3.5" />,
    label: "Rejected",
  },
  ISSUED: {
    badge: "bg-blue-50 text-blue-700 border-blue-200",
    header: "bg-blue-50 border-blue-200",
    dot: "bg-blue-500",
    icon: <FileCheck className="h-3.5 w-3.5" />,
    label: "Pass Issued",
  },
  EXPIRED: {
    badge: "bg-slate-100 text-slate-500 border-slate-200",
    header: "bg-slate-50 border-slate-200",
    dot: "bg-slate-400",
    icon: <AlertTriangle className="h-3.5 w-3.5" />,
    label: "Expired",
  },
};

function getStatusConfig(status: string) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG["EXPIRED"];
}

function StatusBadge({ status }: { status: string }) {
  const cfg = getStatusConfig(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${cfg.badge}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot} shrink-0`} />
      {status}
    </span>
  );
}

function InfoField({ label, value }: { label: string; value?: string | null }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
        {label}
      </p>
      <p className="text-[13px] font-medium text-slate-800">{value || "—"}</p>
    </div>
  );
}

function TimelineEvent({
  icon,
  label,
  date,
  note,
  accent = false,
}: {
  icon: React.ReactNode;
  label: string;
  date?: string;
  note?: string;
  accent?: boolean;
}) {
  if (!date) return null;
  return (
    <div className="flex gap-3">
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${accent ? "bg-primary text-primary-foreground" : "bg-slate-100 text-slate-500"}`}
      >
        {icon}
      </div>
      <div className="pb-4 pt-0.5">
        <p className="text-[12px] font-semibold text-slate-800">{label}</p>
        <p className="text-[11px] text-slate-400">
          {new Date(date).toLocaleString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
        {note && (
          <p className="mt-1 text-[11px] text-slate-600 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
            {note}
          </p>
        )}
      </div>
    </div>
  );
}

function SectionHeading({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="flex h-6 w-6 items-center justify-center rounded-md bg-slate-100 text-slate-500">
        {icon}
      </div>
      <p className="text-[12px] font-semibold uppercase tracking-[0.08em] text-slate-500">
        {label}
      </p>
    </div>
  );
}

function ApplicationDialog({
  app,
  onClose,
}: {
  app: any;
  onClose: () => void;
}) {
  const cfg = getStatusConfig(app.status);

  const fmt = (d?: string) =>
    d
      ? new Date(d).toLocaleDateString("en-IN", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })
      : "—";

  return (
    <DialogContent className="max-w-2xl p-0 overflow-hidden rounded-2xl border border-slate-200 shadow-2xl gap-0">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, ease: EASE_OUT }}
      >
        <div className={`px-6 py-5 border-b ${cfg.header}`}>
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex h-6 w-6 items-center justify-center rounded-md bg-white/60 border border-white/40">
                  <Train className="h-3.5 w-3.5 text-slate-600" />
                </div>
                <p className="text-[13px] font-bold text-slate-800">
                  Concession Application
                </p>
              </div>
              <p className="text-[11px] text-slate-500 pl-8">
                Government Polytechnic Mumbai &mdash; Admin View
              </p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-[11px] font-semibold ${cfg.badge}`}
            >
              {cfg.icon}
              {cfg.label}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-center gap-3 bg-white/60 backdrop-blur-sm border border-white/40 rounded-xl px-5 py-3">
            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-sm font-semibold text-slate-800">
                {app.fromStation}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({app.fromLine})
              </span>
            </div>

            <div className="flex items-center gap-0.5 text-slate-300">
              <div className="h-px w-4 bg-slate-300" />
              <ArrowRight className="h-3.5 w-3.5 text-slate-400 shrink-0" />
            </div>

            <div className="flex items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 text-slate-400 shrink-0" />
              <span className="text-sm font-semibold text-slate-800">
                {app.toStation}
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                ({app.toLine})
              </span>
            </div>
          </div>
        </div>

        <div className="max-h-[60vh] overflow-y-auto">
          <div className="px-6 py-5 border-b border-slate-100">
            <SectionHeading
              icon={<User className="h-3.5 w-3.5" />}
              label="Student Information"
            />
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <InfoField label="Full Name" value={app.student?.fullName} />
              <InfoField label="Enrollment" value={app.student?.enrollmentNo} />
              <InfoField label="Email" value={app.student?.email} />
              <InfoField label="Mobile" value={app.student?.mobileNumber} />
              <InfoField label="Course" value={app.student?.course} />
              <InfoField
                label="Year / Sem"
                value={`${app.student?.year ?? ""} / ${app.student?.sem ?? ""}`}
              />
            </div>
          </div>

          <div className="px-6 py-5 border-b border-slate-100 bg-slate-50/60">
            <SectionHeading
              icon={<FileText className="h-3.5 w-3.5" />}
              label="Application Details"
            />
            <div className="grid grid-cols-2 gap-x-6 gap-y-4 sm:grid-cols-3">
              <InfoField label="Travel Class" value={app.travelClass} />
              <InfoField label="Duration" value={app.duration} />
              <InfoField label="Applied On" value={fmt(app.appliedAt)} />
              {app.concessionNumber && (
                <div className="space-y-0.5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                    Pass Number
                  </p>
                  <p className="font-mono text-[13px] font-semibold text-blue-700">
                    {app.concessionNumber}
                  </p>
                </div>
              )}
              {app.expiryDate && (
                <InfoField label="Expiry Date" value={fmt(app.expiryDate)} />
              )}
              {app.rejectionReason && (
                <div className="col-span-2 sm:col-span-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-red-400 mb-1">
                    Rejection Reason
                  </p>
                  <p className="text-[12px] text-red-700 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                    {app.rejectionReason}
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="px-6 py-5">
            <SectionHeading
              icon={<Clock className="h-3.5 w-3.5" />}
              label="Timeline"
            />
            <div className="relative pl-1">
              <div className="absolute left-[13px] top-2 bottom-2 w-px bg-slate-100" />
              <TimelineEvent
                icon={<Calendar className="h-3 w-3" />}
                label="Application Submitted"
                date={app.appliedAt}
                accent
              />
              <TimelineEvent
                icon={<CheckCircle className="h-3 w-3" />}
                label="Approved"
                date={app.approvedAt}
              />
              <TimelineEvent
                icon={<XCircle className="h-3 w-3" />}
                label="Rejected"
                date={app.rejectedAt}
                note={app.rejectionReason}
              />
              <TimelineEvent
                icon={<Hash className="h-3 w-3" />}
                label="Pass Issued"
                date={
                  app.issuedAt ??
                  (app.status === "ISSUED" ? app.approvedAt : undefined)
                }
                note={
                  app.concessionNumber
                    ? `Pass: ${app.concessionNumber}`
                    : undefined
                }
              />
              <TimelineEvent
                icon={<AlertTriangle className="h-3 w-3" />}
                label="Expired"
                date={
                  app.status === "EXPIRED" &&
                  app.expiryDate &&
                  new Date(app.expiryDate) < new Date()
                    ? app.expiryDate
                    : undefined
                }
              />
            </div>
          </div>
        </div>
      </motion.div>
    </DialogContent>
  );
}

const AdminApplications = () => {
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);

  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await apiFetch("/admin/applications");
        setApplications(data);
      } catch (err) {
        console.error("Failed to load applications", err);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  const formatDate = (date?: string) => {
    if (!date) return "—";
    return new Date(date).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <PageWrapper>
        <main className="container mx-auto max-w-7xl space-y-6 px-4 py-8">
          <motion.div {...fadeIn(0)}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <FileText className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                All Concession Applications
              </h1>
            </div>
            <p className="mt-1 pl-10 text-[13px] text-muted-foreground">
              Government Polytechnic Mumbai — Admin Portal &nbsp;·&nbsp; Click
              any row to view full details
            </p>
          </motion.div>

          <motion.div {...fadeIn(0.07)}>
            <Card className="border border-border shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="px-6 py-4 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Application Records
                  {!loading && (
                    <span className="ml-2 font-normal text-muted-foreground">
                      ({applications.length})
                    </span>
                  )}
                </CardTitle>
              </CardHeader>

              <CardContent className="p-0">
                {loading ? (
                  <div className="flex flex-col items-center justify-center gap-2.5 py-14">
                    <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    <p className="text-[13px] text-muted-foreground">
                      Loading applications…
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-muted/40 hover:bg-muted/40">
                          {[
                            "Student",
                            "Enrollment",
                            "Route",
                            "Class",
                            "Applied On",
                            "Status",
                          ].map((h) => (
                            <TableHead
                              key={h}
                              className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap"
                            >
                              {h}
                            </TableHead>
                          ))}
                        </TableRow>
                      </TableHeader>

                      <TableBody>
                        {applications.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={6}
                              className="py-14 text-center"
                            >
                              <div className="flex flex-col items-center gap-2.5">
                                <FileText className="h-8 w-8 text-muted-foreground/40" />
                                <p className="text-sm text-muted-foreground">
                                  No applications found.
                                </p>
                              </div>
                            </TableCell>
                          </TableRow>
                        ) : (
                          applications.map((app, index) => (
                            <motion.tr
                              key={app.id}
                              initial={{ opacity: 0, y: 5 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{
                                duration: 0.25,
                                delay: index * 0.025,
                                ease: EASE_OUT,
                              }}
                              onClick={() => setSelectedApp(app)}
                              className="cursor-pointer border-b border-border hover:bg-muted/30 transition-colors duration-100 group"
                            >
                              <TableCell className="py-3 font-semibold text-[13px] text-foreground group-hover:text-primary transition-colors whitespace-nowrap">
                                {app.student?.fullName}
                              </TableCell>

                              <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap font-mono">
                                {app.student?.enrollmentNo}
                              </TableCell>

                              <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                                <span className="flex items-center gap-1.5">
                                  <span>{app.fromStation}</span>
                                  <ArrowRight className="h-3 w-3 text-muted-foreground shrink-0" />
                                  <span>{app.toStation}</span>
                                </span>
                              </TableCell>

                              <TableCell className="text-[13px] text-muted-foreground">
                                {app.travelClass}
                              </TableCell>

                              <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                                {formatDate(app.appliedAt)}
                              </TableCell>

                              <TableCell>
                                <StatusBadge status={app.status} />
                              </TableCell>
                            </motion.tr>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </PageWrapper>

      <Dialog open={!!selectedApp} onOpenChange={() => setSelectedApp(null)}>
        <AnimatePresence>
          {selectedApp && (
            <ApplicationDialog
              app={selectedApp}
              onClose={() => setSelectedApp(null)}
            />
          )}
        </AnimatePresence>
      </Dialog>
    </div>
  );
};

export default AdminApplications;
