import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import {
  Train,
  Plus,
  CheckCircle,
  Clock,
  XCircle,
  FileCheck,
  AlertCircle,
  CalendarDays,
  Hash,
} from "lucide-react";
import StudentHeader from "@/components/StudentHeader";
import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const fadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: EASE_OUT, delay },
});

const RailwayConcessionDashboard = () => {
  useEffect(() => {
    const loadApplications = async () => {
      try {
        const data = await apiFetch("/concession/my");
        setApplications(data);
      } catch (err) {
        console.error("Failed to load applications", err);
      } finally {
        setLoading(false);
      }
    };
    loadApplications();
  }, []);

  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const hasActivePass = useMemo(() => {
    const today = new Date();
    return applications.some((app) => {
      if (app.status === "ISSUED" && app.expiryDate) {
        return new Date(app.expiryDate) > today;
      }
      if (app.status === "SUBMITTED" || app.status === "APPROVED") {
        return true;
      }
      return false;
    });
  }, [applications]);

  const currentApplication = useMemo(() => {
    const today = new Date();
    return applications.find((app) => {
      if (app.status === "ISSUED" && app.expiryDate) {
        return new Date(app.expiryDate) > today;
      }
      if (app.status === "SUBMITTED" || app.status === "APPROVED") {
        return true;
      }
      return false;
    });
  }, [applications]);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "SUBMITTED":
        return <Clock className="w-4 h-4 text-warning" />;
      case "APPROVED":
        return <CheckCircle className="w-4 h-4 text-accent" />;
      case "REJECTED":
        return <XCircle className="w-4 h-4 text-destructive" />;
      case "ISSUED":
        return <FileCheck className="w-4 h-4 text-success" />;
    }
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      SUBMITTED: "bg-warning/15 text-warning border-warning/30",
      APPROVED: "bg-accent/15 text-accent border-accent/30",
      REJECTED: "bg-destructive/15 text-destructive border-destructive/30",
      ISSUED: "bg-success/15 text-success border-success/30",
    };
    return styles[status] ?? "bg-muted text-muted-foreground border-border";
  };

  const getStatusMessage = (status?: string) => {
    if (!status) return null;
    const messages: Record<string, string> = {
      SUBMITTED:
        "Your application has been submitted and is pending review by the staff.",
      APPROVED:
        "Your application has been approved. The concession pass will be issued shortly.",
      REJECTED:
        "Your application was rejected. Please check the details and apply again.",
      ISSUED:
        "Your railway concession pass has been issued. You can collect it from the office.",
    };
    return messages[status];
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StudentHeader />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center space-y-2">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Loading concession data…
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />

      <PageWrapper>
        <main className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
          <motion.div
            {...fadeIn(0)}
            className="flex flex-wrap items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Train className="h-4 w-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Railway Concession Portal
                </h1>
              </div>
              <p className="mt-1 pl-10 text-[13px] text-muted-foreground">
                Government Polytechnic Mumbai &mdash; Student Portal
              </p>
            </div>

            <Button
              onClick={() => navigate("/student/railway/apply")}
              disabled={hasActivePass}
              size="sm"
              className="flex items-center gap-2 rounded-lg h-9 px-4 text-sm font-semibold disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Plus className="h-3.5 w-3.5" />
              New Application
            </Button>
          </motion.div>

          <motion.div {...fadeIn(0.07)}>
            <Card className="border border-border shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="px-6 py-4 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Current Application Status
                </CardTitle>
              </CardHeader>
              <CardContent className="px-6 py-5 space-y-4">
                {currentApplication ? (
                  <div className="flex items-start gap-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-muted">
                      {getStatusIcon(currentApplication.status)}
                    </div>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <span
                          className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold ${getStatusBadge(currentApplication.status)}`}
                        >
                          {currentApplication.status}
                        </span>
                        {currentApplication.concessionNumber && (
                          <span className="flex items-center gap-1.5 text-[12px] text-muted-foreground">
                            <Hash className="h-3 w-3" />
                            Pass No:{" "}
                            <span className="font-semibold text-foreground">
                              {currentApplication.concessionNumber}
                            </span>
                          </span>
                        )}
                      </div>

                      <p className="text-[13px] text-muted-foreground leading-relaxed">
                        {getStatusMessage(currentApplication.status)}
                      </p>

                      {currentApplication.expiryDate && (
                        <div className="flex items-center gap-1.5 text-[12px]">
                          <CalendarDays className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="text-muted-foreground">
                            Valid Until:
                          </span>{" "}
                          <span className="font-semibold text-foreground">
                            {new Date(
                              currentApplication.expiryDate,
                            ).toLocaleDateString("en-IN")}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center gap-2.5 py-8 text-center">
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-border bg-muted/40">
                      <Train className="h-5 w-5 text-muted-foreground/50" />
                    </div>
                    <p className="text-sm font-medium text-foreground">
                      No active concession application
                    </p>
                    <p className="text-[12px] text-muted-foreground max-w-xs">
                      Click "New Application" to apply for a railway concession
                      pass.
                    </p>
                  </div>
                )}

                {hasActivePass && (
                  <div className="flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3">
                    <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-warning" />
                    <p className="text-[12px] leading-relaxed text-warning">
                      <span className="font-semibold">Note:</span> You cannot
                      apply for a new concession while you have an active pass
                      or pending application.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>

          <motion.div {...fadeIn(0.13)}>
            <Card className="border border-border shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="px-6 py-4 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Application History
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/40 hover:bg-muted/40">
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          Enrollment No
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          From Line
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          To Line
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          From Station
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          To Station
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          Class
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          Period
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          Applied On
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          Status
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          Rejection Reason
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          Pass No
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          Issue Date
                        </TableHead>
                        <TableHead className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap">
                          Expiry Date
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {applications.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={13} className="py-12 text-center">
                            <div className="flex flex-col items-center gap-2">
                              <Train className="h-8 w-8 text-muted-foreground/40" />
                              <p className="text-sm text-muted-foreground">
                                No applications found.
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : (
                        applications.map((app) => (
                          <TableRow
                            key={app.id}
                            className="hover:bg-muted/30 transition-colors duration-100"
                          >
                            <TableCell className="text-[13px] font-medium text-foreground whitespace-nowrap">
                              {app.student?.enrollmentNo}
                            </TableCell>
                            <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                              {app.fromLine}
                            </TableCell>
                            <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                              {app.toLine}
                            </TableCell>
                            <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                              {app.fromStation}
                            </TableCell>
                            <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                              {app.toStation}
                            </TableCell>
                            <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                              {app.travelClass}
                            </TableCell>
                            <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                              {app.duration}
                            </TableCell>
                            <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                              {formatDate(app.appliedAt)}
                            </TableCell>
                            <TableCell className="whitespace-nowrap">
                              <span
                                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-semibold ${getStatusBadge(app.status)}`}
                              >
                                {app.status}
                              </span>
                            </TableCell>
                            <TableCell className="text-[13px] text-muted-foreground max-w-[160px] truncate">
                              {app.rejectionReason || "-"}
                            </TableCell>
                            <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                              {app.concessionNumber || "-"}
                            </TableCell>
                            <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                              {formatDate(app.approvedAt)}
                            </TableCell>
                            <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                              {formatDate(app.expiryDate)}
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </main>
      </PageWrapper>
    </div>
  );
};

export default RailwayConcessionDashboard;
