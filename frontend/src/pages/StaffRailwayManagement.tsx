
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Clock, CheckCircle, XCircle, FileCheck, Eye } from "lucide-react";
import StaffHeader from "@/components/StaffHeader";
import { useEffect, useState } from "react";
import { getStaffApplications } from "../api/staffConcessions";
import PageWrapper from "@/components/PageWrapper";

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

  const pendingApps = applications.filter(a => a.status === "PENDING");
const approvedApps = applications.filter(
  (a) => a.status === "APPROVED" && !a.concessionNumber
);

  const rejectedApps = applications.filter(a => a.status === "REJECTED");
 const issuedApps = applications.filter(
  (a) => Boolean(a.concessionNumber)
);


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
    <div className="min-h-screen flex items-center justify-center">
      <p>Loading applications...</p>
    </div>
  );
}

  return (
    <div className="min-h-screen bg-background">
      <StaffHeader />

      <PageWrapper>
      <main className="container mx-auto px-4 py-8">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle className="font-heading text-xl">Railway Concession Management</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="pending" className="w-full">
              <TabsList className="grid w-full grid-cols-4 mb-6">
                <TabsTrigger value="pending" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending ({pendingApps.length})
                </TabsTrigger>
                <TabsTrigger value="approved" className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approved ({approvedApps.length})
                </TabsTrigger>
                <TabsTrigger value="rejected" className="flex items-center gap-2">
                  <XCircle className="w-4 h-4" />
                  Rejected ({rejectedApps.length})
                </TabsTrigger>
                <TabsTrigger value="issued" className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4" />
                  Issued ({issuedApps.length})
                </TabsTrigger>
              </TabsList>

              {/* Pending Applications Tab */}
              <TabsContent value="pending">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Application ID</TableHead>
                        <TableHead className="font-semibold">Student Name</TableHead>
                        <TableHead className="font-semibold">Enrollment No</TableHead>
                        <TableHead className="font-semibold">From Station</TableHead>
                        <TableHead className="font-semibold">To Station</TableHead>
                        <TableHead className="font-semibold">Class</TableHead>
                        <TableHead className="font-semibold">Period</TableHead>
                        <TableHead className="font-semibold">Application Date</TableHead>
                        <TableHead className="font-semibold text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingApps.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={9} className="text-center py-8 text-muted-foreground">
                            No pending applications
                          </TableCell>
                        </TableRow>
                      ) : (
                        pendingApps.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.id}</TableCell>
                            <TableCell>{app.student.fullName}</TableCell>
                            <TableCell>{app.student.enrollmentNo}</TableCell>
                            <TableCell>{app.fromStation}</TableCell>
                            <TableCell>{app.toStation}</TableCell>
                            <TableCell>{app.travelClass}</TableCell>
                            <TableCell>{app.duration}</TableCell>
                            <TableCell>{formatDate(app.appliedAt)}</TableCell>
                            <TableCell className="text-center">
                              <Button
                                size="sm"
                                onClick={() => handleProcess(app.id)}
                                className="btn-primary-gradient"
                              >
                                <Eye className="w-4 h-4 mr-1" />
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

              {/* Approved Applications Tab */}
              <TabsContent value="approved">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Application ID</TableHead>
                        <TableHead className="font-semibold">Student Name</TableHead>
                        <TableHead className="font-semibold">Enrollment No</TableHead>
                        <TableHead className="font-semibold">Approved Date</TableHead>
                        <TableHead className="font-semibold text-center">Action</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {approvedApps.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No approved applications pending issuance
                          </TableCell>
                        </TableRow>
                      ) : (
                        approvedApps.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.id}</TableCell>
                            <TableCell>{app.student.fullName}</TableCell>
                            <TableCell>{app.student.enrollmentNo}</TableCell>
                            <TableCell>{app.approvedAt ? formatDate(app.approvedAt) : "-"}</TableCell>
                            <TableCell className="text-center">
                              <Button
                                size="sm"
                                onClick={() => handleProcess(app.id)}
                                className="bg-success hover:bg-success/90 text-white"
                              >
                                <FileCheck className="w-4 h-4 mr-1" />
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

              {/* Rejected Applications Tab */}
              <TabsContent value="rejected">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Application ID</TableHead>
                        <TableHead className="font-semibold">Student Name</TableHead>
                        <TableHead className="font-semibold">Enrollment No</TableHead>
                        <TableHead className="font-semibold">Application Date</TableHead>
                        <TableHead className="font-semibold">Rejection Reason</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {rejectedApps.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            No rejected applications
                          </TableCell>
                        </TableRow>
                      ) : (
                        rejectedApps.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.id}</TableCell>
                            <TableCell>{app.student.fullName}</TableCell>
                            <TableCell>{app.student.enrollmentNo}</TableCell>
                            <TableCell>{formatDate(app.appliedAt)}</TableCell>
                            <TableCell className="text-destructive">{app.rejectionReason}</TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              {/* Issued Applications Tab */}
              <TabsContent value="issued">
                <div className="border rounded-lg overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-muted/50">
                        <TableHead className="font-semibold">Application ID</TableHead>
                        <TableHead className="font-semibold">Student Name</TableHead>
                        <TableHead className="font-semibold">Enrollment No</TableHead>
                        <TableHead className="font-semibold">Concession Number</TableHead>
                        <TableHead className="font-semibold">Issue Date</TableHead>
                        <TableHead className="font-semibold">Issued By</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {issuedApps.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            No issued concessions
                          </TableCell>
                        </TableRow>
                      ) : (
                        issuedApps.map((app) => (
                          <TableRow key={app.id}>
                            <TableCell className="font-medium">{app.id}</TableCell>
                            <TableCell>{app.student.fullName}</TableCell>
                            <TableCell>{app.student.enrollmentNo}</TableCell>
                            <TableCell className="font-mono text-primary">{app.concessionNumber}</TableCell>
                            <TableCell>{app.approvedAt ? formatDate(app.approvedAt) : "-"}</TableCell>
                            <TableCell>Staff</TableCell>
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
      </main>
      </PageWrapper>
    </div>
  );
};

export default StaffRailwayManagement;
