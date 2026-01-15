import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
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
  MapPin
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import StaffHeader, { mockStaffData } from "@/components/StaffHeader";
import { mockStaffApplications, StaffApplication } from "@/data/staffData";

const ApplicationProcessing = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  const application = mockStaffApplications.find(app => app.id === id);

  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [showIssueSection, setShowIssueSection] = useState(application?.status === "Approved");
  const [rejectionReason, setRejectionReason] = useState("");
  const [concessionNumber, setConcessionNumber] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!application) {
    return (
      <div className="min-h-screen bg-background">
        <StaffHeader />
        <main className="container mx-auto px-4 py-8">
          <Card className="border shadow-sm">
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground">Application not found</p>
              <Button variant="outline" className="mt-4" onClick={() => navigate("/staff/railway")}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Management
              </Button>
            </CardContent>
          </Card>
        </main>
      </div>
    );
  }

  const handleApprove = () => {
    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowIssueSection(true);
      toast({
        title: "Application Approved",
        description: "You can now issue the concession form.",
      });
    }, 1000);
  };

  const handleReject = () => {
    if (!rejectionReason.trim()) {
      toast({
        title: "Rejection Reason Required",
        description: "Please provide a reason for rejection.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowRejectDialog(false);
      toast({
        title: "Application Rejected",
        description: "The student will be notified via email.",
      });
      navigate("/staff/railway");
    }, 1000);
  };

  const handleIssue = () => {
    if (!concessionNumber.trim()) {
      toast({
        title: "Concession Number Required",
        description: "Please enter the physical form concession number.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      toast({
        title: "Concession Issued Successfully",
        description: `Concession ${concessionNumber} issued. Email sent to student.`,
      });
      navigate("/staff/railway");
    }, 1000);
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
    const styles = {
      Pending: "bg-warning/20 text-warning border-warning/30",
      Approved: "bg-success/20 text-success border-success/30",
      Rejected: "bg-destructive/20 text-destructive border-destructive/30",
      Issued: "bg-primary/20 text-primary border-primary/30",
    };
    return styles[status as keyof typeof styles] || styles.Pending;
  };

  return (
    <div className="min-h-screen bg-background">
      <StaffHeader />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => navigate("/staff/railway")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-xl font-heading font-bold text-foreground">
                Application Processing
              </h1>
              <p className="text-sm text-muted-foreground">
                Application ID: {application.id}
              </p>
            </div>
          </div>
          <span className={`px-4 py-1.5 rounded-full text-sm font-medium border ${getStatusBadge(application.status)}`}>
            {application.status}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Student Profile */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Student Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Name</p>
                  <p className="font-medium text-foreground">{application.studentName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Enrollment No</p>
                  <p className="font-medium text-foreground">{application.enrollmentNo}</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-2 text-sm">
                <GraduationCap className="w-4 h-4 text-muted-foreground" />
                <span>{application.department}</span>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Year:</span> {application.year}
                </div>
                <div>
                  <span className="text-muted-foreground">Semester:</span> {application.semester}
                </div>
              </div>

              <Separator />

              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-muted-foreground" />
                  <span>DOB: {formatDate(application.dateOfBirth)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{application.studentEmail}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{application.studentPhone}</span>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-muted-foreground mt-0.5" />
                  <span>{application.studentAddress}</span>
                </div>
              </div>

            </CardContent>
          </Card>

          {/* Application Details */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <Train className="w-5 h-5 text-primary" />
                Application Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Application Date</p>
                  <p className="font-medium text-foreground">{formatDate(application.applicationDate)}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Period</p>
                  <p className="font-medium text-foreground">{application.period}</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Route Details</p>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">From Line</p>
                      <p className="font-medium">{application.fromLine}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">To Line</p>
                      <p className="font-medium">{application.toLine}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">From Station</p>
                      <p className="font-medium text-primary">{application.fromStation}</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground mb-1">To Station</p>
                      <p className="font-medium text-primary">{application.toStation}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Travel Class</p>
                <p className="font-medium text-foreground">{application.travelClass}</p>
              </div>

              {application.status === "Issued" && (
                <>
                  <Separator />
                  <div className="p-4 bg-success/10 rounded-lg border border-success/30">
                    <p className="text-xs text-success uppercase tracking-wide mb-2">Issued Details</p>
                    <div className="space-y-2 text-sm">
                      <p><span className="text-muted-foreground">Concession No:</span> <span className="font-mono font-medium">{application.concessionNumber}</span></p>
                      <p><span className="text-muted-foreground">Issue Date:</span> {formatDate(application.issueDate)}</p>
                      <p><span className="text-muted-foreground">Issued By:</span> {application.issuedBy}</p>
                    </div>
                  </div>
                </>
              )}

              {application.status === "Rejected" && (
                <>
                  <Separator />
                  <div className="p-4 bg-destructive/10 rounded-lg border border-destructive/30">
                    <p className="text-xs text-destructive uppercase tracking-wide mb-2">Rejection Details</p>
                    <p className="text-sm">{application.rejectionReason}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Action Section */}
        {(application.status === "Pending" || application.status === "Approved") && (
          <Card className="mt-6 border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-heading text-lg">
                {showIssueSection ? "Issue Concession" : "Process Application"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!showIssueSection ? (
                <div className="flex items-center gap-4">
                  <Button
                    onClick={handleApprove}
                    disabled={isProcessing}
                    className="bg-success hover:bg-success/90 text-white"
                  >
                    <CheckCircle className="w-4 h-4 mr-2" />
                    Approve Application
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => setShowRejectDialog(true)}
                    disabled={isProcessing}
                  >
                    <XCircle className="w-4 h-4 mr-2" />
                    Reject Application
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="p-4 bg-success/10 rounded-lg border border-success/30 mb-4">
                    <p className="text-success font-medium flex items-center gap-2">
                      <CheckCircle className="w-5 h-5" />
                      Application Approved - Ready for Issuance
                    </p>
                  </div>
                  <div className="max-w-md">
                    <Label htmlFor="concessionNumber">Concession Form Number (from physical form)</Label>
                    <Input
                      id="concessionNumber"
                      value={concessionNumber}
                      onChange={(e) => setConcessionNumber(e.target.value.toUpperCase())}
                      placeholder="e.g., RC2026000123"
                      className="mt-2 font-mono"
                    />
                    <p className="text-xs text-muted-foreground mt-2">
                      Enter the serial number from the physical concession form
                    </p>
                  </div>
                  <Button
                    onClick={handleIssue}
                    disabled={isProcessing || !concessionNumber.trim()}
                    className="btn-primary-gradient"
                  >
                    <FileCheck className="w-4 h-4 mr-2" />
                    Issue Concession
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    An email will be sent to the student: "Your railway concession is issued. Collect it from counter between 2 PM – 4 PM."
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>

      {/* Reject Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Application</AlertDialogTitle>
            <AlertDialogDescription>
              Please provide a reason for rejecting this application. This reason will be communicated to the student.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <Textarea
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Enter rejection reason..."
              rows={4}
            />
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleReject}
              className="bg-destructive hover:bg-destructive/90"
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
