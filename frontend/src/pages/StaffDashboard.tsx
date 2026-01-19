import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Train, FileText, Award, HelpCircle, User } from "lucide-react";
import StaffHeader from "@/components/StaffHeader";
import { useEffect, useState } from "react";
import { getStaffApplications } from "../api/staffConcessions";
import PageWrapper from "@/components/PageWrapper";

const StaffDashboard = () => {
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("staffToken");

  const staffInfo = token ? jwtDecode<any>(token) : null;

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading dashboard...</p>
      </div>
    );
  }

  const pendingCount = applications.filter(
    (a) => a.status === "PENDING",
  ).length;
  const approvedCount = applications.filter(
    (a) => a.status === "APPROVED",
  ).length;
  const rejectedCount = applications.filter(
    (a) => a.status === "REJECTED",
  ).length;
  const issuedCount = applications.filter((a) => a.status === "ISSUED").length;

  const adminModules = [
    {
      label: "Railway Concession Management",
      icon: Train,
      path: "/staff/railway",
      description: "Process student concession applications",
      badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
    },
    {
      label: "Exam & Records",
      icon: FileText,
      path: "#",
      description: "Manage examination records",
    },
    {
      label: "Certificates",
      icon: Award,
      path: "#",
      description: "Issue and manage certificates",
    },
    {
      label: "Student Queries",
      icon: HelpCircle,
      path: "#",
      description: "Respond to student inquiries",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StaffHeader />

      <PageWrapper>
        <main className="container mx-auto px-4 py-8">
          {/* Staff Profile Section */}
          <Card className="mb-8 border shadow-sm">
            <CardHeader className="pb-4">
              <CardTitle className="font-heading text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" />
                Staff Profile
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Staff Name
                  </p>
                  <p className="font-medium text-foreground">
                    {staffInfo?.name}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Staff ID
                  </p>
                  <p className="font-medium text-foreground">
                    {staffInfo?.staffId}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Email
                  </p>
                  <p className="font-medium text-foreground">
                    {staffInfo?.email}
                  </p>
                </div>
                <div className="p-4 bg-muted/50 rounded-lg border">
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">
                    Role
                  </p>
                  <p className="font-medium text-foreground">
                    {staffInfo?.role}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <Card className="border shadow-sm">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Pending
                </p>
                <p className="text-2xl font-heading font-bold text-warning">
                  {pendingCount}
                </p>
              </CardContent>
            </Card>
            <Card className="border shadow-sm">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Approved
                </p>
                <p className="text-2xl font-heading font-bold text-success">
                  {approvedCount}
                </p>
              </CardContent>
            </Card>
            <Card className="border shadow-sm">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Rejected
                </p>
                <p className="text-2xl font-heading font-bold text-destructive">
                  {rejectedCount}
                </p>
              </CardContent>
            </Card>
            <Card className="border shadow-sm">
              <CardContent className="pt-4 pb-4">
                <p className="text-xs text-muted-foreground uppercase tracking-wide">
                  Issued
                </p>
                <p className="text-2xl font-heading font-bold text-primary">
                  {issuedCount}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Administrative Modules */}
          <Card className="border shadow-sm">
            <CardHeader>
              <CardTitle className="font-heading text-lg">
                Administrative Modules
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {adminModules.map((module) => (
                  <Button
                    key={module.label}
                    variant="outline"
                    className="h-auto p-4 flex items-start gap-4 justify-start text-left border-2 hover:border-primary/50 hover:bg-secondary/50"
                    onClick={() => module.path !== "#" && navigate(module.path)}
                    disabled={module.path === "#"}
                  >
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <module.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-foreground">
                          {module.label}
                        </p>
                        {module.badge && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-warning/20 text-warning rounded-full border border-warning/30">
                            {module.badge}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground mt-1">
                        {module.description}
                      </p>
                    </div>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </PageWrapper>
    </div>
  );
};

export default StaffDashboard;
