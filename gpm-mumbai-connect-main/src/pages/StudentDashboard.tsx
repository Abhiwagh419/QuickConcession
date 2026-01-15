import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import StudentHeader from "@/components/StudentHeader";
import { apiFetch } from "@/lib/api";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

import {
  Train,
  FileText,
  CreditCard,
  Award,
  User,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

const StudentDashboard = () => {
  const navigate = useNavigate();

  const [student, setStudent] = useState<any>(null);
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const studentData = await apiFetch("/student/me");
        const appsData = await apiFetch("/concession/my");

        setStudent(studentData);
        setApplications(appsData);
      } catch (err: any) {
        setError(err.message || "Failed to load dashboard");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <StudentHeader />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-muted-foreground">Loading dashboard…</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="min-h-screen bg-background">
        <StudentHeader />
        <div className="flex justify-center items-center h-[60vh]">
          <p className="text-destructive">{error ?? "No student data"}</p>
        </div>
      </div>
    );
  }

  const activePass = applications.find((a) => a.status === "APPROVED");
  const pendingApp = applications.find(
    (a) => a.status === "PENDING"
  );

  const services = [
    {
      label: "Railway Concession",
      icon: Train,
      onClick: () => navigate("/student/railway"),
      description: "Apply for railway concession pass",
    },
    {
      label: "Exam Forms",
      icon: FileText,
      onClick: () => {},
      description: "Fill and submit exam forms",
    },
    {
      label: "Fees & Payments",
      icon: CreditCard,
      onClick: () => {},
      description: "View and pay college fees",
    },
    {
      label: "Certificates",
      icon: Award,
      onClick: () => {},
      description: "Request bonafide and other certificates",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />

      <main className="container mx-auto px-4 py-6 max-w-6xl">
        <h1 className="font-heading text-2xl font-bold text-foreground mb-6">
          Student Dashboard
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT */}
          <div className="lg:col-span-2 space-y-6">
            {/* STUDENT DETAILS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="w-5 h-5 text-primary" />
                  Student Details
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Enrollment</p>
                  <p>{student.enrollmentNo}</p>

                  <p className="text-xs text-muted-foreground mt-3">Name</p>
                  <p>{student.fullName}</p>

                  <p className="text-xs text-muted-foreground mt-3">Course</p>
                  <p>{student.course}</p>
                </div>

                <div>
                  <p className="text-xs text-muted-foreground">Year</p>
                  <p>{student.year}</p>

                  <p className="text-xs text-muted-foreground mt-3">Semester</p>
                  <p>{student.sem}</p>

                  <p className="text-xs text-muted-foreground mt-3">Shift</p>
                  <p>{student.shift}</p>
                </div>
              </CardContent>
            </Card>

            {/* CONCESSION STATUS */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Train className="w-5 h-5 text-primary" />
                  Railway Concession Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {activePass ? (
                  <div className="p-4 border rounded bg-success/10">
                    <CheckCircle className="text-success mb-2" />
                    <p className="font-medium">Active Concession</p>
                    <p className="text-sm">
                      {activePass.fromStation} → {activePass.toStation}
                    </p>
                    <Badge className="mt-2">APPROVED</Badge>
                  </div>
                ) : pendingApp ? (
                  <div className="p-4 border rounded bg-warning/10">
                    <Clock className="text-warning mb-2" />
                    <p className="font-medium">Application Pending</p>
                    <p className="text-sm">
                      {pendingApp.fromStation} → {pendingApp.toStation}
                    </p>
                  </div>
                ) : (
                  <div className="p-4 border rounded bg-muted">
                    <AlertCircle className="mb-2" />
                    <p>No active concession</p>
                    <Button
                      size="sm"
                      className="mt-3"
                      onClick={() => navigate("/student/railway")}
                    >
                      Apply Now
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

         
          <div className="space-y-6">
            <Card className="border shadow-sm">
              <CardHeader className="pb-3 border-b bg-muted/30">
                <CardTitle className="text-lg font-heading">Student Services</CardTitle>
              </CardHeader>
              <CardContent className="pt-4 space-y-3">
                {services.map((s) => (
                  <Button
                    key={s.label}
                    variant="outline"
                    onClick={s.onClick}
                    className="w-full h-auto py-4 justify-start gap-3 border-2 hover:bg-secondary hover:border-primary/30"
                  >
                    <s.icon className="w-5 h-5 text-primary flex-shrink-0" />
                    <div className="text-left">
                      <p className="font-medium text-foreground">{s.label}</p>
                      <p className="text-xs text-muted-foreground">{s.description}</p>
                    </div>
                  </Button>
                ))}
              </CardContent>
            </Card>

            {/* Quick Info */}
            <Card className="border shadow-sm bg-secondary/30">
              <CardContent className="pt-4">
                <p className="text-xs text-muted-foreground">
                  <strong className="text-foreground">Notice:</strong> For any issues with the portal, 
                  please contact the IT Department during office hours (10 AM - 5 PM).
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StudentDashboard;
