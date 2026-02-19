import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, CheckCircle, XCircle, FileCheck, Eye, Train } from "lucide-react";
import StaffHeader from "@/components/StaffHeader";
import { useEffect, useState } from "react";
import { getStaffApplications } from "../api/staffConcessions";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const fadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: EASE_OUT, delay },
});

// ─── Shared table head style ──────────────────────────────────────────────────

const TH = "text-[11px] font-semibold uppercase tracking-wider text-muted-foreground whitespace-nowrap";

// ─── Empty state ──────────────────────────────────────────────────────────────

function EmptyRow({ colSpan, message }: { colSpan: number; message: string }) {
  return (
    <TableRow>
      <TableCell colSpan={colSpan} className="py-12 text-center">
        <div className="flex flex-col items-center gap-2">
          <Train className="h-7 w-7 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">{message}</p>
        </div>
      </TableCell>
    </TableRow>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

const StaffRailwayManagement = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const data = await getStaffApplications();
        setApplications(data);
      } catch (err) {
        console.error("Failed to load applications", err);
      } finally {
        setLoading(false);
      }
    };
    fetchApplications();
  }, []);

  const pendingApps  = applications.filter((a) => a.status === "PENDING");
  const approvedApps = applications.filter((a) => a.status === "APPROVED" && !a.concessionNumber);
  const rejectedApps = applications.filter((a) => a.status === "REJECTED");
  const issuedApps   = applications.filter((a) => Boolean(a.concessionNumber));

  const handleProcess = (appId: string) => {
    navigate(`/staff/railway/process/${appId}`);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StaffHeader />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center space-y-2">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">Loading applications…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StaffHeader />

      <PageWrapper>
        <main className="container mx-auto max-w-7xl space-y-6 px-4 py-8">

          {/* ── Page Header ──────────────────────────────────────────── */}
          <motion.div
            {...fadeIn(0)}
            className="flex items-start justify-between flex-wrap gap-4"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <Train className="h-4 w-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Railway Concession Management
                </h1>
              </div>
              <p className="mt-1 pl-10 text-[13px] text-muted-foreground">
                Government Polytechnic Mumbai &mdash; Staff Portal
              </p>
            </div>
          </motion.div>

          {/* ── Main Card ────────────────────────────────────────────── */}
          <motion.div {...fadeIn(0.07)}>
            <Card className="border border-border shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="px-6 py-4 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Application Queue
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 py-6">
                <Tabs defaultValue="pending" className="w-full">

                  {/* ── Tab Bar ────────────────────────────────────────── */}
                  <TabsList className="grid w-full grid-cols-4 mb-6 h-10 rounded-lg bg-muted p-0.5 gap-0.5">
                    <TabsTrigger
                      value="pending"
                      className="
                        flex items-center justify-center gap-1.5 rounded-md h-full
                        text-[12px] font-medium text-muted-foreground
                        data-[state=active]:bg-card data-[state=active]:text-warning
                        data-[state=active]:shadow-sm data-[state=active]:font-semibold
                        transition-all duration-150
                      "
                    >
                      <Clock className="h-3.5 w-3.5 shrink-0" />
                      Pending
                      <span className="ml-0.5 tabular-nums">({pendingApps.length})</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="approved"
                      className="
                        flex items-center justify-center gap-1.5 rounded-md h-full
                        text-[12px] font-medium text-muted-foreground
                        data-[state=active]:bg-card data-[state=active]:text-primary
                        data-[state=active]:shadow-sm data-[state=active]:font-semibold
                        transition-all duration-150
                      "
                    >
                      <CheckCircle className="h-3.5 w-3.5 shrink-0" />
                      Approved
                      <span className="ml-0.5 tabular-nums">({approvedApps.length})</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="rejected"
                      className="
                        flex items-center justify-center gap-1.5 rounded-md h-full
                        text-[12px] font-medium text-muted-foreground
                        data-[state=active]:bg-card data-[state=active]:text-destructive
                        data-[state=active]:shadow-sm data-[state=active]:font-semibold
                        transition-all duration-150
                      "
                    >
                      <XCircle className="h-3.5 w-3.5 shrink-0" />
                      Rejected
                      <span className="ml-0.5 tabular-nums">({rejectedApps.length})</span>
                    </TabsTrigger>

                    <TabsTrigger
                      value="issued"
                      className="
                        flex items-center justify-center gap-1.5 rounded-md h-full
                        text-[12px] font-medium text-muted-foreground
                        data-[state=active]:bg-card data-[state=active]:text-success
                        data-[state=active]:shadow-sm data-[state=active]:font-semibold
                        transition-all duration-150
                      "
                    >
                      <FileCheck className="h-3.5 w-3.5 shrink-0" />
                      Issued
                      <span className="ml-0.5 tabular-nums">({issuedApps.length})</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* ── Pending ─────────────────────────────────────────── */}
                  <TabsContent value="pending">
                    <div className="rounded-xl border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className={TH}>App ID</TableHead>
                            <TableHead className={TH}>Student Name</TableHead>
                            <TableHead className={TH}>Enrollment No</TableHead>
                            <TableHead className={TH}>From Station</TableHead>
                            <TableHead className={TH}>To Station</TableHead>
                            <TableHead className={TH}>Class</TableHead>
                            <TableHead className={TH}>Period</TableHead>
                            <TableHead className={TH}>Applied On</TableHead>
                            <TableHead className={`${TH} text-center`}>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {pendingApps.length === 0 ? (
                            <EmptyRow colSpan={9} message="No pending applications" />
                          ) : (
                            pendingApps.map((app) => (
                              <TableRow
                                key={app.id}
                                className="hover:bg-muted/30 transition-colors duration-100"
                              >
                                <TableCell className="text-[13px] font-medium text-foreground">
                                  {app.id}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                                  {app.student.fullName}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                                  {app.student.enrollmentNo}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                                  {app.fromStation}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                                  {app.toStation}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground">
                                  {app.travelClass}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground">
                                  {app.duration}
                                </TableCell>
                                <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                                  {formatDate(app.appliedAt)}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    size="sm"
                                    onClick={() => handleProcess(app.id)}
                                    className="h-8 rounded-lg px-3 text-[12px] font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-150 flex items-center gap-1.5 mx-auto"
                                  >
                                    <Eye className="h-3.5 w-3.5" />
                                    Review
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* ── Approved ────────────────────────────────────────── */}
                  <TabsContent value="approved">
                    <div className="rounded-xl border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className={TH}>App ID</TableHead>
                            <TableHead className={TH}>Student Name</TableHead>
                            <TableHead className={TH}>Enrollment No</TableHead>
                            <TableHead className={TH}>Approved Date</TableHead>
                            <TableHead className={`${TH} text-center`}>Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {approvedApps.length === 0 ? (
                            <EmptyRow colSpan={5} message="No approved applications pending issuance" />
                          ) : (
                            approvedApps.map((app) => (
                              <TableRow
                                key={app.id}
                                className="hover:bg-muted/30 transition-colors duration-100"
                              >
                                <TableCell className="text-[13px] font-medium text-foreground">
                                  {app.id}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                                  {app.student.fullName}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                                  {app.student.enrollmentNo}
                                </TableCell>
                                <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                                  {app.approvedAt ? formatDate(app.approvedAt) : "-"}
                                </TableCell>
                                <TableCell className="text-center">
                                  <Button
                                    size="sm"
                                    onClick={() => handleProcess(app.id)}
                                    className="h-8 rounded-lg px-3 text-[12px] font-semibold bg-success hover:bg-success/90 text-success-foreground transition-colors duration-150 flex items-center gap-1.5 mx-auto"
                                  >
                                    <FileCheck className="h-3.5 w-3.5" />
                                    Issue
                                  </Button>
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* ── Rejected ────────────────────────────────────────── */}
                  <TabsContent value="rejected">
                    <div className="rounded-xl border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className={TH}>App ID</TableHead>
                            <TableHead className={TH}>Student Name</TableHead>
                            <TableHead className={TH}>Enrollment No</TableHead>
                            <TableHead className={TH}>Application Date</TableHead>
                            <TableHead className={TH}>Rejection Reason</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rejectedApps.length === 0 ? (
                            <EmptyRow colSpan={5} message="No rejected applications" />
                          ) : (
                            rejectedApps.map((app) => (
                              <TableRow
                                key={app.id}
                                className="hover:bg-muted/30 transition-colors duration-100"
                              >
                                <TableCell className="text-[13px] font-medium text-foreground">
                                  {app.id}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                                  {app.student.fullName}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                                  {app.student.enrollmentNo}
                                </TableCell>
                                <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                                  {formatDate(app.appliedAt)}
                                </TableCell>
                                <TableCell className="text-[13px] text-destructive max-w-[200px] truncate">
                                  {app.rejectionReason}
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                  {/* ── Issued ──────────────────────────────────────────── */}
                  <TabsContent value="issued">
                    <div className="rounded-xl border border-border overflow-hidden">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-muted/40 hover:bg-muted/40">
                            <TableHead className={TH}>App ID</TableHead>
                            <TableHead className={TH}>Student Name</TableHead>
                            <TableHead className={TH}>Enrollment No</TableHead>
                            <TableHead className={TH}>Concession Number</TableHead>
                            <TableHead className={TH}>Issue Date</TableHead>
                            <TableHead className={TH}>Issued By</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {issuedApps.length === 0 ? (
                            <EmptyRow colSpan={6} message="No issued concessions" />
                          ) : (
                            issuedApps.map((app) => (
                              <TableRow
                                key={app.id}
                                className="hover:bg-muted/30 transition-colors duration-100"
                              >
                                <TableCell className="text-[13px] font-medium text-foreground">
                                  {app.id}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                                  {app.student.fullName}
                                </TableCell>
                                <TableCell className="text-[13px] text-foreground whitespace-nowrap">
                                  {app.student.enrollmentNo}
                                </TableCell>
                                <TableCell className="font-mono text-[13px] font-semibold text-primary whitespace-nowrap">
                                  {app.concessionNumber}
                                </TableCell>
                                <TableCell className="text-[13px] text-muted-foreground whitespace-nowrap">
                                  {app.approvedAt ? formatDate(app.approvedAt) : "-"}
                                </TableCell>
                                <TableCell className="text-[13px] text-muted-foreground">
                                  Staff
                                </TableCell>
                              </TableRow>
                            ))
                          )}
                        </TableBody>
                      </Table>
                    </div>
                  </TabsContent>

                </Tabs>
              </CardContent>
            </Card>
          </motion.div>

          {/* ── Footer ───────────────────────────────────────────────── */}
          <motion.div
            {...fadeIn(0.18)}
            className="flex items-center gap-3 pb-6"
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

export default StaffRailwayManagement;