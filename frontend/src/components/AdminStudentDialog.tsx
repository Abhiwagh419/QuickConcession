import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { apiFetch } from "@/lib/api";
import {
  BarChart,
  Bar,
  XAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  User,
  Train,
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  data: any | null;
  refresh: () => void;
}

const AdminStudentDialog = ({ open, onClose, data, refresh }: Props) => {

  /* ================= STATES ================= */

  const [activeTab, setActiveTab] = useState("profile");

  const [form, setForm] = useState<any>({
    fullName: "",
    email: "",
    mobileNumber: "",
    course: "",
    year: "",
    sem: "",
    shift: "",
    address: "",
    dateOfBirth: "",
  });

  const [original, setOriginal] = useState<any>(form);
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const [openAppDetails, setOpenAppDetails] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState<any | null>(null);
  const [appDetailsLoading, setAppDetailsLoading] = useState(false);

  /* ================= MEMO ================= */

  const initials = useMemo(() => {
    if (!data?.fullName) return "";
    return data.fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [data]);

  const chartData = useMemo(() => {
    return [
      { name: "Approved", value: data?.analytics?.approved || 0 },
      { name: "Issued", value: data?.analytics?.issued || 0 },
      { name: "Rejected", value: data?.analytics?.rejected || 0 },
      { name: "Pending", value: data?.analytics?.pending || 0 },
    ];
  }, [data]);

  /* ================= SYNC ================= */

  useEffect(() => {
    if (data) {
      const formatted = {
        fullName: data.fullName || "",
        email: data.email || "",
        mobileNumber: data.mobileNumber || "",
        course: data.course || "",
        year: data.year || "",
        sem: data.sem || "",
        shift: data.shift || "",
        address: data.address || "",
        dateOfBirth: data.dateOfBirth
          ? data.dateOfBirth.slice(0, 10)
          : "",
      };
      setForm(formatted);
      setOriginal(formatted);
    }
  }, [data]);

  if (!data) return null;

  const isChanged = JSON.stringify(form) !== JSON.stringify(original);

  /* ================= ACTIONS ================= */

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      await apiFetch(`/admin/students/${data.id}`, {
        method: "PATCH",
        body: JSON.stringify(form),
      });
      setOriginal(form);
      refresh();
    } finally {
      setIsSaving(false);
    }
  };

  const toggleActive = async () => {
    setIsProcessing(true);
    await apiFetch(`/admin/students/${data.id}/toggle`, {
      method: "PATCH",
    });
    refresh();
    setIsProcessing(false);
  };

  const softDelete = async () => {
    if (!confirm("Are you sure?")) return;
    setIsProcessing(true);
    await apiFetch(`/admin/students/${data.id}/delete`, {
      method: "PATCH",
    });
    refresh();
    setIsProcessing(false);
    onClose();
  };

  const restoreStudent = async () => {
    setIsProcessing(true);
    await apiFetch(`/admin/students/${data.id}/restore`, {
      method: "PATCH",
    });
    refresh();
    setIsProcessing(false);
  };

  const resetPassword = async () => {
    try {
      setIsResetting(true);
      await apiFetch(`/admin/students/${data.id}/reset-password`, {
        method: "POST",
        body: JSON.stringify({ newPassword }),
      });
      setNewPassword("");
    } finally {
      setIsResetting(false);
    }
  };

  const openApplicationDetails = async (id: number) => {
    setOpenAppDetails(true);
    setAppDetailsLoading(true);
    try {
      const result = await apiFetch(`/admin/applications/${id}`);
      setSelectedApplication(result);
    } finally {
      setAppDetailsLoading(false);
    }
  };

  /* ================= UI ================= */

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-6xl rounded-2xl shadow-2xl">

          <DialogHeader>
            <DialogTitle className="text-xl font-semibold">
              Student Management Panel
            </DialogTitle>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-muted p-1 rounded-xl">
              {["profile","edit","analytics","applications","controls"].map(tab => (
                <TabsTrigger key={tab} value={tab}>
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </TabsTrigger>
              ))}
            </TabsList>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >

                {/* ================= PROFILE ================= */}
                {activeTab === "profile" && (
                  <div className="space-y-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarFallback>{initials}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-lg font-semibold">{data.fullName}</p>
                        <Badge variant="secondary">STUDENT</Badge>
                      </div>
                    </div>

                    <Separator />

                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <p><strong>Enrollment:</strong> {data.enrollmentNo}</p>
                      <p><strong>Email:</strong> {data.email}</p>
                      <p><strong>Mobile:</strong> {data.mobileNumber}</p>
                      <p><strong>Course:</strong> {data.course}</p>
                      <p><strong>Year:</strong> {data.year}</p>
                      <p><strong>Semester:</strong> {data.sem}</p>
                      <p><strong>Shift:</strong> {data.shift}</p>
                      <p><strong>Address:</strong> {data.address || "-"}</p>
                      <p><strong>DOB:</strong> {data.dateOfBirth
                        ? new Date(data.dateOfBirth).toLocaleDateString("en-IN")
                        : "-"}</p>
                    </div>
                  </div>
                )}

                {/* ================= EDIT ================= */}
                {activeTab === "edit" && (
                  <div className="space-y-4">
                    {Object.entries(form).map(([key,value]) => (
                      <div key={key}>
                        <Label className="capitalize">{key}</Label>
                        <Input
                          value={value as string}
                          onChange={(e) =>
                            setForm({ ...form, [key]: e.target.value })
                          }
                        />
                      </div>
                    ))}

                    <Button
                      onClick={saveChanges}
                      disabled={!isChanged || isSaving}
                      className="w-full"
                    >
                      {isSaving ? "Saving..." : isChanged ? "Save Changes" : "Saved"}
                    </Button>
                  </div>
                )}

                {/* ================= ANALYTICS ================= */}
                {activeTab === "analytics" && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-4 gap-4 text-center">
                      <div className="p-4 border rounded-xl">
                        <p className="text-xs text-muted-foreground">Total</p>
                        <p className="text-xl font-semibold">
                          {data.analytics?.total || 0}
                        </p>
                      </div>
                      <div className="p-4 border rounded-xl">
                        <p className="text-xs text-muted-foreground">Approved</p>
                        <p className="text-xl font-semibold">
                          {data.analytics?.approved || 0}
                        </p>
                      </div>
                      <div className="p-4 border rounded-xl">
                        <p className="text-xs text-muted-foreground">Issued</p>
                        <p className="text-xl font-semibold">
                          {data.analytics?.issued || 0}
                        </p>
                      </div>
                      <div className="p-4 border rounded-xl">
                        <p className="text-xs text-muted-foreground">Rejected</p>
                        <p className="text-xl font-semibold">
                          {data.analytics?.rejected || 0}
                        </p>
                      </div>
                    </div>

                    <ResponsiveContainer width="100%" height={250}>
                      <BarChart data={chartData}>
                        <XAxis dataKey="name" />
                        <Tooltip />
                        <Bar dataKey="value" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}

                {/* ================= APPLICATIONS ================= */}
                {activeTab === "applications" && (
                  <div className="space-y-3 max-h-[400px] overflow-y-auto">
                    {data.applications?.map((app:any)=>(
                      <div
                        key={app.id}
                        onClick={() => openApplicationDetails(app.id)}
                        className="cursor-pointer border rounded-lg p-4 hover:shadow-md transition"
                      >
                        <div className="flex justify-between">
                          <span>{app.fromStation} → {app.toStation}</span>
                          <Badge>{app.status}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mt-1">
                          Applied: {new Date(app.appliedAt).toLocaleDateString("en-IN")}
                        </p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ================= CONTROLS ================= */}
                {activeTab === "controls" && (
                  <div className="space-y-6">

                    <Button
                      variant="outline"
                      onClick={toggleActive}
                      disabled={isProcessing}
                      className="w-full"
                    >
                      {data.active ? "Deactivate Account" : "Activate Account"}
                    </Button>

                    <div className="space-y-3">
                      <Label>Set New Password</Label>
                      <Input
                        type="password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                      <Button
                        onClick={resetPassword}
                        disabled={!newPassword || isResetting}
                        className="w-full"
                      >
                        {isResetting ? "Updating..." : "Update Password"}
                      </Button>
                    </div>

                    {data.isDeleted ? (
                      <Button onClick={restoreStudent} className="w-full">
                        Restore Student
                      </Button>
                    ) : (
                      <Button variant="destructive" onClick={softDelete} className="w-full">
                        Soft Delete Student
                      </Button>
                    )}
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </Tabs>
        </DialogContent>
      </Dialog>
      {/* ================= FULL APPLICATION DETAILS ================= */}
      <Dialog open={openAppDetails} onOpenChange={setOpenAppDetails}>
        <DialogContent className="max-w-6xl rounded-2xl shadow-2xl">

          <DialogHeader>
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Train className="w-5 h-5 text-primary" />
              Concession Application Details
            </DialogTitle>
          </DialogHeader>

          {appDetailsLoading && (
            <div className="py-10 text-center text-muted-foreground">
              Loading application details...
            </div>
          )}

          {selectedApplication && (
            <div className="space-y-8">

              {/* ================= STATUS BAR ================= */}
              <div className="flex justify-between items-center bg-muted/40 border rounded-xl p-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    Application ID
                  </p>
                  <p className="text-lg font-semibold">
                    #{selectedApplication.id}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    className={`
                      px-4 py-1 text-sm
                      ${selectedApplication.status === "ISSUED"
                        ? "bg-green-100 text-green-700"
                        : selectedApplication.status === "APPROVED"
                        ? "bg-blue-100 text-blue-700"
                        : selectedApplication.status === "REJECTED"
                        ? "bg-red-100 text-red-700"
                        : selectedApplication.status === "EXPIRED"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-gray-100 text-gray-700"
                      }
                    `}
                  >
                    {selectedApplication.status}
                  </Badge>

                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => window.print()}
                  >
                    Print PDF
                  </Button>
                </div>
              </div>

              {/* ================= PROGRESS STEPS ================= */}
              <div className="flex items-center justify-between relative">

                {["APPLIED","APPROVED","ISSUED","EXPIRED"].map((step, index) => {

                  const statusOrder = {
                    APPLIED: 0,
                    PENDING: 0,
                    APPROVED: 1,
                    ISSUED: 2,
                    EXPIRED: 3,
                  };

                  const currentIndex =
                    statusOrder[selectedApplication.status as keyof typeof statusOrder] ?? 0;

                  const active = index <= currentIndex;

                  return (
                    <div key={step} className="flex-1 flex flex-col items-center relative">

                      <div
                        className={`
                          w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
                          ${active ? "bg-primary text-white" : "bg-muted text-muted-foreground"}
                        `}
                      >
                        {index + 1}
                      </div>

                      <p className="text-xs mt-2">{step}</p>

                      {index < 3 && (
                        <div
                          className={`
                            absolute top-4 left-1/2 w-full h-1 -z-10
                            ${active ? "bg-primary" : "bg-muted"}
                          `}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              {/* ================= MAIN GRID ================= */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                {/* STUDENT PANEL */}
                <div className="rounded-2xl border p-6 bg-card shadow-sm space-y-4">

                  <h3 className="font-semibold text-lg">Student Information</h3>
                  <Separator />

                  <div className="space-y-2 text-sm">
                    <p><strong>Name:</strong> {selectedApplication.student.fullName}</p>
                    <p><strong>Enrollment:</strong> {selectedApplication.student.enrollmentNo}</p>
                    <p><strong>Email:</strong> {selectedApplication.student.email}</p>
                    <p><strong>Mobile:</strong> {selectedApplication.student.mobileNumber}</p>
                    <p><strong>Course:</strong> {selectedApplication.student.course}</p>
                    <p><strong>Year:</strong> {selectedApplication.student.year}</p>
                    <p><strong>Semester:</strong> {selectedApplication.student.sem}</p>
                    <p><strong>Shift:</strong> {selectedApplication.student.shift}</p>
                    <p><strong>Address:</strong> {selectedApplication.student.address}</p>
                  </div>
                </div>

                {/* APPLICATION PANEL */}
                <div className="rounded-2xl border p-6 bg-card shadow-sm space-y-4">

                  <h3 className="font-semibold text-lg">Application Details</h3>
                  <Separator />

                  <div className="space-y-2 text-sm">
                    <p><strong>From:</strong> {selectedApplication.fromStation}</p>
                    <p><strong>To:</strong> {selectedApplication.toStation}</p>
                    <p><strong>From Line:</strong> {selectedApplication.fromLine}</p>
                    <p><strong>To Line:</strong> {selectedApplication.toLine}</p>
                    <p><strong>Class:</strong> {selectedApplication.travelClass}</p>
                    <p><strong>Duration:</strong> {selectedApplication.duration}</p>
                    <p><strong>Applied On:</strong> {new Date(selectedApplication.appliedAt).toLocaleString("en-IN")}</p>

                    {selectedApplication.approvedAt && (
                      <p><strong>Approved At:</strong> {new Date(selectedApplication.approvedAt).toLocaleString("en-IN")}</p>
                    )}

                    {selectedApplication.rejectedAt && (
                      <p className="text-destructive">
                        <strong>Rejected At:</strong> {new Date(selectedApplication.rejectedAt).toLocaleString("en-IN")}
                      </p>
                    )}

                    {selectedApplication.rejectionReason && (
                      <div className="bg-destructive/10 border border-destructive/30 p-3 rounded-lg">
                        <p className="font-medium text-destructive text-sm">
                          Rejection Reason
                        </p>
                        <p className="text-sm">
                          {selectedApplication.rejectionReason}
                        </p>
                      </div>
                    )}

                    {selectedApplication.concessionNumber && (
                      <div className="bg-green-50 border border-green-200 p-3 rounded-lg">
                        <p className="text-xs text-muted-foreground">
                          Concession Number
                        </p>
                        <p className="font-semibold">
                          {selectedApplication.concessionNumber}
                        </p>
                      </div>
                    )}

                    {selectedApplication.expiryDate && (
                      <p><strong>Expiry:</strong> {new Date(selectedApplication.expiryDate).toLocaleDateString("en-IN")}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* ================= ADMIN ACTIONS ================= */}
              <div className="flex gap-4 justify-end border-t pt-6">

                {selectedApplication.status === "PENDING" && (
                  <>
                    <Button
                      variant="destructive"
                      onClick={async () => {
                        await apiFetch(`/admin/applications/${selectedApplication.id}/reject`, {
                          method: "PATCH",
                        });
                        setOpenAppDetails(false);
                        refresh();
                      }}
                    >
                      Reject
                    </Button>

                    <Button
                      onClick={async () => {
                        await apiFetch(`/admin/applications/${selectedApplication.id}/approve`, {
                          method: "PATCH",
                        });
                        setOpenAppDetails(false);
                        refresh();
                      }}
                    >
                      Approve
                    </Button>
                  </>
                )}

              </div>

            </div>
          )}
        </DialogContent>
      </Dialog>
 </>
  );
};

export default AdminStudentDialog;