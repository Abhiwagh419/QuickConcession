import { useEffect, useState } from "react";
import PageWrapper from "@/components/PageWrapper";
import AdminHeader from "@/components/AdminHeader";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalStaff: 0,
    totalApplications: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
  });

  // Static for now – later connect real API
  useEffect(() => {
    setStats({
      totalStudents: 120,
      totalStaff: 8,
      totalApplications: 75,
      pendingApplications: 14,
      approvedApplications: 52,
      rejectedApplications: 9,
    });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <PageWrapper>
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <h1 className="font-heading text-2xl font-bold text-foreground mb-6">
            Admin Dashboard
          </h1>

          {/* ================= STATS SECTION ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Students
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.totalStudents}
                  </p>
                </div>
                <Users className="w-8 h-8 text-primary" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Staff
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.totalStaff}
                  </p>
                </div>
                <UserCog className="w-8 h-8 text-primary" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Total Applications
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.totalApplications}
                  </p>
                </div>
                <FileText className="w-8 h-8 text-primary" />
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground">
                    Pending Applications
                  </p>
                  <p className="text-2xl font-bold">
                    {stats.pendingApplications}
                  </p>
                </div>
                <Clock className="w-8 h-8 text-warning" />
              </CardContent>
            </Card>
          </div>

          {/* ================= APPLICATION STATUS BREAKDOWN ================= */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-primary" />
                Application Status Overview
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-4">
              <Badge className="bg-warning text-white px-4 py-2">
                Pending: {stats.pendingApplications}
              </Badge>
              <Badge className="bg-success text-white px-4 py-2">
                Approved: {stats.approvedApplications}
              </Badge>
              <Badge className="bg-destructive text-white px-4 py-2">
                Rejected: {stats.rejectedApplications}
              </Badge>
            </CardContent>
          </Card>

          {/* ================= MANAGEMENT MODULES ================= */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-primary" />
                  Student Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => navigate("/admin/students")}
                >
                  Manage Students
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UserCog className="w-5 h-5 text-primary" />
                  Staff Management
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => navigate("/admin/staff")}
                >
                  Manage Staff
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-primary" />
                  Application Oversight
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => navigate("/admin/applications")}
                >
                  View Applications
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Settings className="w-5 h-5 text-primary" />
                  System Controls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Button
                  className="w-full"
                  onClick={() => navigate("/admin/settings")}
                >
                  Configure System
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* ================= SECURITY + ACTIVITY ================= */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                Security & Monitoring
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-sm">
              <div className="flex items-center justify-between">
                <span>Recent Admin Login</span>
                <span className="text-muted-foreground">
                  Today, 09:14 AM
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span>System Status</span>
                <Badge className="bg-success text-white">
                  Active
                </Badge>
              </div>

              <div className="flex items-center justify-between">
                <span>Application Window</span>
                <Badge className="bg-warning text-white">
                  Open
                </Badge>
              </div>
            </CardContent>
          </Card>
        </main>
      </PageWrapper>
    </div>
  );
};

export default AdminDashboard;
