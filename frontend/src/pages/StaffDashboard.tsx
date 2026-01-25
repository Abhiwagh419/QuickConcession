import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Train, FileText, Award, HelpCircle, User, Globe,Landmark, School} from "lucide-react";
import StaffHeader from "@/components/StaffHeader";
import { useEffect, useState } from "react";
import { getStaffApplications } from "../api/staffConcessions";
import PageWrapper from "@/components/PageWrapper";
import { apiFetch } from "@/lib/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import {
  GraduationCap,
  Calendar,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";

const StaffDashboard = () => {
  const [openDetails, setOpenDetails] = useState(false);
  const [selectedApp, setSelectedApp] = useState<any | null>(null);
const [detailsLoading, setDetailsLoading] = useState(false);
const [detailsError, setDetailsError] = useState<string | null>(null);
  const navigate = useNavigate();
  const [applications, setApplications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const token = localStorage.getItem("staffToken");
const [enrollmentNo, setEnrollmentNo] = useState("");
const [history, setHistory] = useState<any[]>([]);
const [historyLoading, setHistoryLoading] = useState(false);
const [historyError, setHistoryError] = useState<string | null>(null);
const [historyFilter, setHistoryFilter] = useState<
  "ALL" | "PENDING" | "APPROVED" | "EXPIRED" | "REJECTED"
>("ALL");

  const staffInfo = token ? jwtDecode<any>(token) : null;
const [openStudentDialog, setOpenStudentDialog] = useState(false);
const [openHistoryPanel, setOpenHistoryPanel] = useState(false);

const [studentSummary, setStudentSummary] = useState<any | null>(null);
const [summaryLoading, setSummaryLoading] = useState(false);

const openApplicationDetails = async (id: number) => {
  setOpenDetails(true);
  setDetailsLoading(true);

  try {
    const data = await apiFetch(`/staff/concessions/${id}`);
    setSelectedApp(data);
  } finally {
    setDetailsLoading(false);
  }
};

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

const handleSearchStudent = async () => {
  if (!enrollmentNo.trim()) return;
  if (enrollmentNo.trim().length < 9) return;

  setSummaryLoading(true);
  setStudentSummary(null);

  try {
    const data = await apiFetch(
      `/staff/students/${enrollmentNo}/summary`
    );

    setStudentSummary(data);
    setOpenStudentDialog(true);
  } catch {
    // ❌ NO alert
    setStudentSummary(null);
    setOpenStudentDialog(false);
  } finally {
    setSummaryLoading(false);
  }
};

const fetchHistory = async () => {
  if (!enrollmentNo.trim()) return;

  setHistory([]);
  setSelectedApp(null); // 🔹 add this
  setHistoryError(null);
  setHistoryLoading(true);

  try {
    const data = await apiFetch(
      `/staff/applications/by-enrollment/${enrollmentNo}`
    );
    setHistory(data);
  } catch (err: any) {
    setHistoryError(err.message || "Failed to fetch history");
  } finally {
    setHistoryLoading(false);
  }
};

useEffect(() => {
  if (!enrollmentNo.trim()) {
    setHistory([]);
    setSelectedApp(null);
    return;
  }

  const debounceTimer = setTimeout(() => {
    handleSearchStudent();
  }, 500); // ⏳ 500ms debounce

  return () => clearTimeout(debounceTimer);
}, [enrollmentNo]);


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
  
const issuedCount = applications.filter(
  (a) => a.status === "ISSUED" || a.status === "EXPIRED"
).length;

const adminModules = [
  {
    label: "Railway Concession Management",
    icon: Train,
    type: "internal",
    path: "/staff/railway",
    description: "Process student concession applications",
    badge: pendingCount > 0 ? `${pendingCount} Pending` : null,
  },
  {
    label: "Institute Website",
    icon: Landmark,
    type: "external",
    url: "https://gpmumbai.ac.in/gpmweb/", 
    description: "Official Government Polytechnic Mumbai portal",
  },
  {
    label: "MSBTE Portal",
    icon: School,
    type: "external",
    url: "https://msbte.ac.in/",
    description: "Board circulars, exam schedules, results",
  },
  {
    label: "Scholarship Portal",
    icon: GraduationCap,
    type: "external",
    url: "https://mahadbt.maharashtra.gov.in/Home/Index",
    description: "Government scholarships & DBT status",
  },
];

const filteredHistory =
  historyFilter === "ALL"
    ? history
    : history.filter((app) => app.status === historyFilter);

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
         
         <Card className="mb-8 border shadow-sm">
  <CardHeader>
    <CardTitle className="font-heading text-lg">
      Student Lookup
    </CardTitle>
  </CardHeader>

  <CardContent>
    <input
      className="w-full md:w-80 border rounded-md px-3 py-2 text-sm"
      placeholder="Enter Enrollment Number"
      value={enrollmentNo}
      onChange={(e) => setEnrollmentNo(e.target.value.toUpperCase())}
    />

    <p className="text-xs text-muted-foreground mt-2">
      Enetr Student Enrollment Number to view details and application history.
    </p>
  </CardContent>
</Card>

{/* Student Summary Dialog */}
<Dialog open={openStudentDialog} onOpenChange={setOpenStudentDialog}>
  <DialogContent className="max-w-xl animate-in fade-in zoom-in-95">
    <DialogHeader>
      <DialogTitle>Student Summary</DialogTitle>
    </DialogHeader>

    {summaryLoading && <p>Loading summary...</p>}

    {studentSummary && (
      <div className="space-y-5">
        {/* HEADER */}
        <div className="flex items-center gap-4">
  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
    <User className="w-7 h-7 text-primary" />
  </div>

  <div>
    <p className="text-xl font-semibold">
      {studentSummary.student.fullName}
    </p>
    <p className="text-sm text-muted-foreground">
      {studentSummary.student.enrollmentNo}
    </p>
  </div>
</div>

<Separator />

<div className="grid grid-cols-2 gap-4 text-sm">
  <p><strong>Course:</strong> {studentSummary.student.course}</p>
  <p><strong>Year:</strong> {studentSummary.student.year}</p>
  <p><strong>Semester:</strong> {studentSummary.student.sem}</p>
  <p><strong>Shift:</strong> {studentSummary.student.shift}</p>
</div>
<Separator />

<div className="space-y-1 text-sm">
  <p><strong>Email:</strong> {studentSummary.student.email}</p>
  <p><strong>Mobile:</strong> {studentSummary.student.mobileNumber}</p>

  {studentSummary.student.dateOfBirth && (
    <p>
      <strong>DOB:</strong>{" "}
      {new Date(studentSummary.student.dateOfBirth).toLocaleDateString("en-IN")}
    </p>
  )}

  {studentSummary.student.address && (
    <p>
      <strong>Address:</strong> {studentSummary.student.address}
    </p>
  )}
</div>

        <Separator />

        {/* STATS */}
        <div className="grid grid-cols-4 gap-3 text-center">
  <div className="rounded-lg bg-warning/10 p-3">
    <p className="text-xs text-warning">Pending</p>
    <p className="text-xl font-semibold">{studentSummary.stats.pending}</p>
  </div>

  <div className="rounded-lg bg-success/10 p-3">
    <p className="text-xs text-success">Issued</p>
    <p className="text-xl font-semibold text-success">
      {studentSummary.stats.issued}
    </p>
  </div>

  <div className="rounded-lg bg-destructive/10 p-3">
    <p className="text-xs text-destructive">Rejected</p>
    <p className="text-xl font-semibold text-destructive">
      {studentSummary.stats.rejected}
    </p>
  </div>

  <div className="rounded-lg bg-muted p-3">
    <p className="text-xs text-muted-foreground">Total</p>
    <p className="text-xl font-semibold">
      {studentSummary.stats.total}
    </p>
  </div>
</div>

        <Separator />

        {/* LATEST APPLICATION */}
        {studentSummary.latest ? (
          <div className="space-y-1 text-sm">
            <p>
              <strong>Latest Application:</strong>
            </p>
            <p>
              Status: {studentSummary.latest.status} <br />
              Route: {studentSummary.latest.fromStation} →{" "}
              {studentSummary.latest.toStation} <br />
              Applied On:{" "}
              {new Date(
                studentSummary.latest.appliedAt,
              ).toLocaleDateString("en-IN")}
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No applications found for this student.
          </p>
        )}

        <Button
          className="  w-full mt-2
  focus:outline-none
  focus:ring-0
  focus-visible:outline-none
  focus-visible:ring-0
  focus-visible:ring-offset-0"
          onClick={() => {
            setOpenStudentDialog(false);
            setOpenHistoryPanel(true);
            fetchHistory();
          }}
        >
          View Full Application History
        </Button>
      </div>
    )}
  </DialogContent>
</Dialog>

<Dialog
  open={openHistoryPanel}
  onOpenChange={(open) => {
    setOpenHistoryPanel(open);
    if (open) {
      setHistoryFilter("ALL"); // ✅ reset filter on open
    }
  }}
>
<DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto animate-fade-up">
    <DialogHeader>
      <DialogTitle>Application History</DialogTitle>
    </DialogHeader>

    {/* 🔹 FILTER BUTTONS */}
<div className="flex gap-2 mb-4 flex-wrap">
  {["ALL", "PENDING", "APPROVED", "EXPIRED", "REJECTED"].map((f) => (
    <Button
      key={f}
      size="sm"
      variant={historyFilter === f ? "default" : "outline"}
      onClick={() =>
        setHistoryFilter(
          f as "ALL" | "PENDING" | "APPROVED" | "EXPIRED" | "REJECTED"
        )
      }
    >
      {f}
    </Button>
  ))}
</div>

{filteredHistory.map((app, index) => (
  <Card
  key={app.id}
  onClick={() => {
    if (app.status === "PENDING") {
      navigate(`/staff/railway/process/${app.id}`);
    } else {
      openApplicationDetails(app.id);
    }
  }}
  className="
    cursor-pointer
    border
    rounded-lg
    p-4
    transition-all
    hover:shadow-md
    hover:-translate-y-0.5
    animate-fade-up
  "
>
  <div className="flex justify-between items-center">
    <span
      className={`px-3 py-1 rounded-full text-xs font-semibold
        ${
          app.status === "ISSUED"
            ? "bg-success/20 text-success"
            : app.status === "EXPIRED"
            ? "bg-warning/20 text-warning"
            : app.status === "REJECTED"
            ? "bg-destructive/20 text-destructive"
            : "bg-primary/20 text-primary"
        }
      `}
    >
      {app.status}
    </span>

    <span className="text-xs text-muted-foreground">
      {new Date(app.appliedAt).toLocaleDateString("en-IN")}
    </span>
  </div>

  <p className="mt-2 font-medium">
    {app.fromStation} → {app.toStation}
  </p>
</Card>

))}

  </DialogContent>
</Dialog>

{/* Application Details Modal */}
<Dialog open={openDetails} onOpenChange={setOpenDetails}>
<DialogContent className="max-w-4xl animate-dialog-in shadow-2xl rounded-xl">

    <DialogHeader>
      <DialogTitle>Concession Application Details</DialogTitle>
    </DialogHeader>

    {detailsLoading && <p>Loading details...</p>}

    {selectedApp && (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Student Profile */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <User className="w-4 h-4" /> Student Details
          </h3>

          <p><strong>Name:</strong> {selectedApp.student.fullName}</p>
          <p><strong>Enrollment:</strong> {selectedApp.student.enrollmentNo}</p>

          <Separator />

          <p className="flex items-center gap-2 text-sm">
            <GraduationCap className="w-4 h-4" />
            {selectedApp.student.course} – Sem {selectedApp.student.sem}
          </p>

          <p className="flex items-center gap-2 text-sm">
            <Mail className="w-4 h-4" /> {selectedApp.student.email}
          </p>

          <p className="flex items-center gap-2 text-sm">
            <Phone className="w-4 h-4" /> {selectedApp.student.mobileNumber}
          </p>

          <p className="flex items-start gap-2 text-sm">
            <MapPin className="w-4 h-4 mt-0.5" />
            {selectedApp.student.address}
          </p>
        </div>

        {/* Application Details */}
        <div className="bg-muted/30 rounded-lg p-4 space-y-3">
          <h3 className="font-semibold flex items-center gap-2">
            <Train className="w-4 h-4" /> Application Details
          </h3>

          <p><strong>Status:</strong> {selectedApp.status}</p>
          <p><strong>Duration:</strong> {selectedApp.duration}</p>
          <p><strong>Class:</strong> {selectedApp.travelClass}</p>

          <Separator />

          <p>
            <strong>Route:</strong><br />
            {selectedApp.fromStation} → {selectedApp.toStation}
          </p>

          <p className="flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" />
            Applied on{" "}
            {new Date(selectedApp.appliedAt).toLocaleDateString("en-IN")}
          </p>

          {selectedApp.status === "REJECTED" && (
            <p className="text-destructive">
              <strong>Rejected On:</strong>{" "}
              {new Date(selectedApp.rejectedAt).toLocaleDateString("en-IN")}
              <br />
              <strong>Reason:</strong> {selectedApp.rejectionReason}
            </p>
          )}

          {(selectedApp.status === "ISSUED" ||
            selectedApp.status === "EXPIRED") && (
            <p className="text-success">
              <strong>Pass No:</strong> {selectedApp.concessionNumber}
              <br />
              <strong>
                {selectedApp.status === "EXPIRED"
                  ? "Expired On"
                  : "Expires On"}
                :
              </strong>{" "}
              {new Date(selectedApp.expiryDate).toLocaleDateString("en-IN")}
            </p>
          )}
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>


{detailsLoading && (
  <p className="text-sm text-muted-foreground">
    Loading application details...
  </p>
)}

{detailsError && (
  <p className="text-sm text-destructive">{detailsError}</p>
)}

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
                    onClick={() => {
  if (module.type === "internal") {
    navigate(module.path);
  } else {
    window.open(module.url, "_blank", "noopener,noreferrer");
  }
}}

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
