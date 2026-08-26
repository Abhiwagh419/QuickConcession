import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { staffAxios } from "../api/staffAxios";
import { approveApplication, rejectApplication } from "../api/staffActions";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  User,
  GraduationCap,
  Train,
  CheckCircle,
  XCircle,
  FileCheck,
  ArrowLeft,
  Calendar,
  Phone,
  Mail,
  MapPin,
  AlertCircle,
  Hash,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StaffHeader from "@/components/StaffHeader";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const fadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: EASE_OUT, delay },
});

function InfoField({
  label,
  value,
}: {
  label: string;
  value?: string | number;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

const ApplicationProcessing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [concessionNumber, setConcessionNumber] = useState("");
  const [rejectionReason, setRejectionReason] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  const [application, setApplication] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showIssueSection, setShowIssueSection] = useState(false);

  useEffect(() => {
    if (application?.status === "APPROVED") {
      setShowIssueSection(true);
    }
  }, [application]);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const res = await staffAxios.get(`/staff/concessions/${id}`);
        setApplication(res.data);
      } catch (err) {
        console.error("Failed to fetch application", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchApplication();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StaffHeader />
        <div className="flex h-[60vh] items-center justify-center">
          <div className="text-center space-y-2">
            <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              Loading application…
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (!application) {
    return (
      <div className="min-h-screen bg-background">
        <StaffHeader />
        <PageWrapper>
          <main className="container mx-auto max-w-lg px-4 py-16">
            <div className="rounded-2xl border-black/[0.08] bg-card overflow-hidden">
              <div className="border-b border-border bg-muted/20 px-6 py-4 flex items-center gap-2.5">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
                  <AlertCircle className="h-3.5 w-3.5 text-destructive" />
                </div>
                <span className="text-sm font-semibold text-foreground">
                  Application Not Found
                </span>
              </div>
              <div className="px-6 py-10 text-center space-y-4">
                <p className="text-[13px] text-muted-foreground">
                  The application you are looking for could not be found or may
                  have been removed.
                </p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/staff/railway")}
                  className="h-9 rounded-lg border-border text-sm font-semibold hover:bg-muted hover:border-primary/40 transition-all duration-150 flex items-center gap-2 mx-auto"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Back to Management
                </Button>
              </div>
            </div>
          </main>
        </PageWrapper>
      </div>
    );
  }

  const handleApprove = async () => {
    try {
      setIsProcessing(true);
      await staffAxios.post(`/staff/concessions/${application.id}/approve`, {});
      const res = await staffAxios.get(`/staff/concessions/${id}`);
      setApplication(res.data);
      toast({
        title: "Application Approved",
        description: "You can now issue the concession.",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast({ title: "Rejection reason required", variant: "destructive" });
      return;
    }
    try {
      setIsProcessing(true);
      await rejectApplication(application.id, rejectionReason);
      toast({ title: "Application Rejected" });
      navigate("/staff/railway");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleIssue = async () => {
    if (!concessionNumber.trim()) {
      toast({ title: "Concession number required", variant: "destructive" });
      return;
    }
    try {
      setIsProcessing(true);
      await approveApplication(application.id, concessionNumber);
      toast({
        title: "Concession Issued",
        description: `Pass No: ${concessionNumber}`,
      });
      navigate("/staff/railway");
    } finally {
      setIsProcessing(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      PENDING: "bg-warning/15 text-warning border-warning/30",
      APPROVED: "bg-success/15 text-success border-success/30",
      REJECTED: "bg-destructive/15 text-destructive border-destructive/30",
      EXPIRED: "bg-primary/15 text-primary border-primary/30",
    };
    return styles[status] ?? styles.PENDING;
  };

  return (
    <div className="min-h-screen bg-background">
      <StaffHeader />

      <PageWrapper>
        <main className="container mx-auto max-w-6xl space-y-6 px-4 py-8">
          <motion.div
            {...fadeIn(0)}
            className="flex flex-wrap items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate("/staff/railway")}
                className="h-8 rounded-lg border-border text-[13px] font-medium hover:bg-muted hover:border-primary/30 transition-all duration-150 flex items-center gap-1.5 mt-0.5"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back
              </Button>
              <div>
                <div className="flex items-center gap-2.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                    <Train className="h-4 w-4 text-primary-foreground" />
                  </div>
                  <h1 className="text-[22px] font-semibold tracking-[-0.02em] text-foreground">
                    Application Processing
                  </h1>
                </div>
                <p className="mt-1 pl-10 text-[13px] text-muted-foreground">
                  Application ID:{" "}
                  <span className="font-mono font-medium text-foreground">
                    {application.id}
                  </span>
                </p>
              </div>
            </div>

            <span
              className={`inline-flex items-center rounded-full border px-3 py-1 text-[12px] font-semibold ${getStatusBadge(application.status)}`}
            >
              {application.status}
            </span>
          </motion.div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            <motion.div {...fadeIn(0.07)}>
              <Card className="border-black/[0.08] overflow-hidden h-full">
                <CardHeader className="px-6 py-4 border-b border-border bg-muted/20">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                      <User className="h-3.5 w-3.5 text-primary" />
                    </div>
                    Student Profile
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-5 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField
                      label="Full Name"
                      value={application.student.fullName}
                    />
                    <InfoField
                      label="Enrollment No"
                      value={application.student.enrollmentNo}
                    />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-foreground">
                      <GraduationCap className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {application.student.course}
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <InfoField
                        label="Year"
                        value={application.student.year}
                      />
                      <InfoField
                        label="Semester"
                        value={application.student.sem}
                      />
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-2.5">
                    {application.student.dateOfBirth && (
                      <div className="flex items-center gap-2 text-[13px] text-foreground">
                        <Calendar className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                        DOB: {formatDate(application.student.dateOfBirth)}
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-[13px] text-foreground">
                      <Mail className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {application.student.email}
                    </div>
                    <div className="flex items-center gap-2 text-[13px] text-foreground">
                      <Phone className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                      {application.student.mobileNumber}
                    </div>
                    <div className="flex items-start gap-2 text-[13px] text-foreground">
                      <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
                      {application.student.address}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div {...fadeIn(0.11)}>
              <Card className="border-black/[0.08] overflow-hidden h-full">
                <CardHeader className="px-6 py-4 border-b border-border bg-muted/20">
                  <CardTitle className="flex items-center gap-2 text-sm font-semibold text-foreground">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary/10">
                      <Train className="h-3.5 w-3.5 text-primary" />
                    </div>
                    Application Details
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-5 space-y-5">
                  <div className="grid grid-cols-2 gap-4">
                    <InfoField
                      label="Application Date"
                      value={formatDate(application.appliedAt)}
                    />
                    <InfoField label="Period" value={application.duration} />
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                      Route Details
                    </p>
                    <div className="rounded-xl border border-border bg-muted/30 px-4 py-4 space-y-3">
                      <div className="grid grid-cols-2 gap-4">
                        <InfoField
                          label="From Line"
                          value={application.fromLine}
                        />
                        <InfoField label="To Line" value={application.toLine} />
                      </div>
                      <Separator />
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            From Station
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            {application.fromStation}
                          </p>
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                            To Station
                          </p>
                          <p className="text-sm font-semibold text-primary">
                            {application.toStation}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <InfoField
                    label="Travel Class"
                    value={application.travelClass}
                  />

                  {application.status === "APPROVED" &&
                    application.concessionNumber && (
                      <>
                        <Separator />
                        <div className="rounded-xl border border-success/30 bg-success/10 px-4 py-4 space-y-2">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-success">
                            Issued Details
                          </p>
                          <div className="space-y-1.5 text-[13px]">
                            <div className="flex items-center gap-1.5">
                              <Hash className="h-3 w-3 text-muted-foreground" />
                              <span className="text-muted-foreground">
                                Concession No:
                              </span>{" "}
                              <span className="font-mono font-semibold text-foreground">
                                {application.concessionNumber}
                              </span>
                            </div>
                            <p>
                              <span className="text-muted-foreground">
                                Issue Date:
                              </span>{" "}
                              <span className="font-medium text-foreground">
                                {formatDate(application.approvedAt)}
                              </span>
                            </p>
                            <p>
                              <span className="text-muted-foreground">
                                Issued By:
                              </span>{" "}
                              <span className="font-medium text-foreground">
                                {application.issuedBy}
                              </span>
                            </p>
                          </div>
                        </div>
                      </>
                    )}

                  {application.status === "REJECTED" && (
                    <>
                      <Separator />
                      <div className="rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-4 space-y-1.5">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-destructive">
                          Rejection Details
                        </p>
                        <p className="text-[13px] text-foreground">
                          {application.rejectionReason}
                        </p>
                      </div>
                    </>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {(application.status === "PENDING" ||
            (application.status === "APPROVED" &&
              !application.concessionNumber)) && (
            <motion.div {...fadeIn(0.16)}>
              <Card className="border-black/[0.08] overflow-hidden">
                <CardHeader className="px-6 py-4 border-b border-border bg-muted/20">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    {showIssueSection
                      ? "Issue Concession"
                      : "Process Application"}
                  </CardTitle>
                </CardHeader>
                <CardContent className="px-6 py-6">
                  {!showIssueSection ? (
                    <div className="space-y-4">
                      <p className="text-[13px] text-muted-foreground">
                        Review the application details above and choose an
                        action.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button
                          onClick={handleApprove}
                          disabled={isProcessing}
                          className="h-9 rounded-lg px-5 text-sm font-semibold bg-success hover:bg-success/90 text-white transition-colors duration-150 flex items-center gap-2"
                        >
                          <CheckCircle className="h-4 w-4" />
                          Approve Application
                        </Button>
                        <Button
                          variant="destructive"
                          onClick={() => setShowRejectDialog(true)}
                          disabled={isProcessing}
                          className="h-9 rounded-lg px-5 text-sm font-semibold transition-colors duration-150 flex items-center gap-2"
                        >
                          <XCircle className="h-4 w-4" />
                          Reject Application
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-5">
                      <div className="flex items-start gap-2.5 rounded-xl border border-success/30 bg-success/10 px-4 py-3">
                        <CheckCircle className="h-4 w-4 text-success shrink-0 mt-0.5" />
                        <p className="text-[13px] font-semibold text-success">
                          Application Approved — Ready for Issuance
                        </p>
                      </div>

                      <div className="max-w-sm space-y-1.5">
                        <Label
                          htmlFor="concessionNumber"
                          className="text-[12px] font-semibold text-foreground"
                        >
                          Concession Form Number{" "}
                          <span className="text-destructive">*</span>
                        </Label>
                        <Input
                          id="concessionNumber"
                          value={concessionNumber}
                          onChange={(e) =>
                            setConcessionNumber(e.target.value.toUpperCase())
                          }
                          placeholder="e.g., RC2026000123"
                          className="font-mono h-9 rounded-lg border-border bg-background text-sm"
                        />
                        <p className="text-[11px] text-muted-foreground">
                          Enter the serial number from the physical concession
                          form.
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Button
                          onClick={handleIssue}
                          disabled={isProcessing || !concessionNumber.trim()}
                          className="h-9 rounded-lg px-5 text-sm font-semibold bg-primary hover:bg-primary/90 text-primary-foreground transition-colors duration-150 flex items-center gap-2 disabled:opacity-50"
                        >
                          <FileCheck className="h-4 w-4" />
                          Issue Concession
                        </Button>
                        <p className="text-[12px] text-muted-foreground">
                          An email will be sent to the student: "Your railway
                          concession is issued. Collect it from counter between
                          2 PM – 4 PM."
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div
            {...fadeIn(0.22)}
            className="flex items-center gap-3 pb-6"
          >
            <div className="h-px flex-1 bg-border" />
            <p className="whitespace-nowrap px-3 text-[11px] text-muted-foreground">
              Railway Concession Management System &mdash; Government
              Polytechnic Mumbai &mdash; Staff Portal
            </p>
            <div className="h-px flex-1 bg-border" />
          </motion.div>
        </main>
      </PageWrapper>

      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent className="rounded-xl border border-border">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-base font-semibold text-foreground">
              Reject Application
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[13px] text-muted-foreground">
              Please provide a reason for rejecting this application. This
              reason will be communicated to the student.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-3">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason…"
              rows={4}
              className="resize-none rounded-lg border-border bg-background text-sm"
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel className="h-9 rounded-lg border-border text-sm font-medium hover:bg-muted">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="h-9 rounded-lg text-sm font-semibold bg-destructive hover:bg-destructive/90 transition-colors duration-150"
              disabled={isProcessing}
            >
              Confirm Rejection
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ApplicationProcessing;
