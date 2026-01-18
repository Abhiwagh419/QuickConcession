import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Train, Plus, CheckCircle, Clock, XCircle, FileCheck } from "lucide-react";
import StudentHeader from "@/components/StudentHeader";
import { useEffect, useState, useMemo } from "react";
import { apiFetch } from "@/lib/api";
import PageWrapper from "@/components/PageWrapper";
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


  // Check if there's an active (non-expired) pass
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
    const styles = {
      SUBMITTED: "bg-warning/15 text-warning border-warning/30",
      APPROVED: "bg-accent/15 text-accent border-accent/30",
      REJECTED: "bg-destructive/15 text-destructive border-destructive/30",
      ISSUED: "bg-success/15 text-success border-success/30",
    };
    return styles[status];
  };

  const getStatusMessage = (status?: string) => {
    if (!status) return null;
    
    const messages = {
      SUBMITTED: "Your application has been submitted and is pending review by the staff.",
      APPROVED: "Your application has been approved. The concession pass will be issued shortly.",
      REJECTED: "Your application was rejected. Please check the details and apply again.",
      ISSUED: "Your railway concession pass has been issued. You can collect it from the office.",
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
        <div className="p-6">Loading concession data…</div>
      </div>
    );
  }  

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />

      <PageWrapper>
      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Train className="w-7 h-7 text-primary" />
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Railway Concession Portal
            </h1>
          </div>
          <Button
            onClick={() => navigate("/student/railway/apply")}
            disabled={hasActivePass}
            className="gap-2"
          >
            <Plus className="w-4 h-4" />
            New Application
          </Button>
        </div>

        {/* Section 1: Application Status */}
        <Card className="border shadow-sm mb-6">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-lg font-heading">Current Application Status</CardTitle>
          </CardHeader>
          <CardContent className="pt-4">
            {currentApplication ? (
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center">
                  {getStatusIcon(currentApplication.status)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusBadge(currentApplication.status)}`}>
                      {currentApplication.status}
                    </span>
                    {currentApplication.concessionNumber && (
                      <span className="text-sm text-muted-foreground">
                        Pass No: <strong className="text-foreground">{currentApplication.concessionNumber}</strong>
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {getStatusMessage(currentApplication.status)}
                  </p>
                  {currentApplication.expiryDate && (
                    <p className="text-sm mt-2">
                      <span className="text-muted-foreground">Valid Until: </span>
                      <strong className="text-foreground">{currentApplication?.expiryDate? new Date(currentApplication.expiryDate).toLocaleDateString("en-IN"): "-"}</strong>
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-6">
                <Train className="w-12 h-12 text-muted-foreground mx-auto mb-3" />
                <p className="text-muted-foreground">No active concession application.</p>
                <p className="text-sm text-muted-foreground">Click "New Application" to apply for a railway concession pass.</p>
              </div>
            )}

            {hasActivePass && (
              <div className="mt-4 p-3 bg-warning/10 border border-warning/30 rounded-lg">
                <p className="text-sm text-warning">
                  <strong>Note:</strong> You cannot apply for a new concession while you have an active pass or pending application.
                </p>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Section 2: Past Applications Table */}
        <Card className="border shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-lg font-heading">Application History</CardTitle>
          </CardHeader>
          <CardContent className="pt-0">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="font-semibold text-foreground">Enrollment No</TableHead>
                    <TableHead className="font-semibold text-foreground">From Line</TableHead>
                    <TableHead className="font-semibold text-foreground">To Line</TableHead>
                    <TableHead className="font-semibold text-foreground">From Station</TableHead>
                    <TableHead className="font-semibold text-foreground">To Station</TableHead>
                    <TableHead className="font-semibold text-foreground">Class</TableHead>
                    <TableHead className="font-semibold text-foreground">Period</TableHead>
                    <TableHead className="font-semibold text-foreground">Applied On</TableHead>
                    <TableHead className="font-semibold text-foreground">Status</TableHead>
                    <TableHead className="font-semibold text-foreground">Rejection Reason</TableHead>
                    <TableHead className="font-semibold text-foreground">Pass No</TableHead>
                    <TableHead className="font-semibold text-foreground">Issue Date</TableHead>
                    <TableHead className="font-semibold text-foreground">Expiry Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {applications.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={12} className="text-center py-8 text-muted-foreground">
                        No applications found.
                      </TableCell>
                    </TableRow>
                  ) : (
                    applications.map((app) => (
                      <TableRow key={app.id} className="hover:bg-muted/30">
                        <TableCell className="font-medium">{app.student?.enrollmentNo}</TableCell>
                        <TableCell>{app.fromLine}</TableCell>
                        <TableCell>{app.toLine}</TableCell>
                        <TableCell>{app.fromStation}</TableCell>
                        <TableCell>{app.toStation}</TableCell>
                        <TableCell>{app.travelClass}</TableCell>
                        <TableCell>{app.duration}</TableCell>
                        <TableCell>{formatDate(app.appliedAt)}</TableCell>
                        <TableCell>
                          <span className={`px-2 py-1 rounded text-xs font-medium border ${getStatusBadge(app.status)}`}>
                            {app.status}
                          </span>
                        </TableCell>
                        <TableCell>{app.rejectionReason || "-"}</TableCell>
                        <TableCell>{app.concessionNumber || "-"}</TableCell>
                        <TableCell>{formatDate(app.approvedAt)}</TableCell>
                        <TableCell>{formatDate(app.expiryDate)}</TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>
      </PageWrapper>
    </div>
  );
};

export default RailwayConcessionDashboard;
