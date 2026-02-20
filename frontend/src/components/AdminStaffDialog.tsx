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

interface Props {
  open: boolean;
  onClose: () => void;
  data: any | null;
  refresh: () => void;
}

interface StaffForm {
  fullName: string;
  email: string;
}

const AdminStaffDialog = ({ open, onClose, data, refresh }: Props) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [form, setForm] = useState<StaffForm>({ fullName: "", email: "" });
  const [original, setOriginal] = useState<StaffForm>({ fullName: "", email: "" });
  const [isSaving, setIsSaving] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  const initials = useMemo(() => {
    if (!data?.fullName) return "";
    return data.fullName
      .split(" ")
      .map((n: string) => n[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  }, [data]);

  useEffect(() => {
    if (data) {
      const formatted = {
        fullName: data.fullName || "",
        email: data.email || "",
      };
      setForm(formatted);
      setOriginal(formatted);
      setActiveTab("profile");
    }
  }, [data]);

  if (!data) return null;

  const isChanged = JSON.stringify(form) !== JSON.stringify(original);

  /* ================= ACTIONS ================= */

  const saveChanges = async () => {
    try {
      setIsSaving(true);
      await apiFetch(`/admin/staff/${data.id}`, {
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
    await apiFetch(`/admin/staff/${data.id}/toggle`, { method: "PATCH" });
    refresh();
    setIsProcessing(false);
  };

  const softDelete = async () => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    setIsProcessing(true);
    await apiFetch(`/admin/staff/${data.id}/delete`, { method: "PATCH" });
    refresh();
    setIsProcessing(false);
    onClose();
  };

  const restoreStaff = async () => {
    setIsProcessing(true);
    await apiFetch(`/admin/staff/${data.id}/restore`, { method: "PATCH" });
    refresh();
    setIsProcessing(false);
  };

  const resetPassword = async () => {
    try {
      setIsResetting(true);
      await apiFetch(`/admin/staff/${data.id}/reset-password`, {
        method: "POST",
        body: JSON.stringify({ newPassword }),
      });
      setNewPassword("");
    } finally {
      setIsResetting(false);
    }
  };

  /* ================= UI ================= */

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Staff Management Panel
          </DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6 bg-muted p-1 rounded-xl">
            {["profile", "edit", "controls"].map((tab) => (
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

                    <div className="space-y-1">
                      <p className="text-lg font-semibold">{data.fullName}</p>

                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">{data.role}</Badge>

                        {data.isDeleted ? (
                          <Badge variant="destructive">Deleted</Badge>
                        ) : data.active ? (
                          <Badge className="bg-green-100 text-green-700">
                            Active
                          </Badge>
                        ) : (
                          <Badge className="bg-red-100 text-red-700">
                            Inactive
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">
                        Full Name
                      </p>
                      <p className="font-medium">{data.fullName}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">
                        Email
                      </p>
                      <p className="font-medium">{data.email}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">
                        Role
                      </p>
                      <p className="font-medium">{data.role}</p>
                    </div>

                    <div>
                      <p className="text-xs text-muted-foreground uppercase mb-1">
                        Joined
                      </p>
                      <p className="font-medium">
                        {new Date(data.createdAt).toLocaleDateString("en-IN")}
                      </p>
                    </div>
                  </div>

                  {typeof data._count?.approvedApplications === "number" && (
                    <>
                      <Separator />
                      <div>
                        <p className="text-xs text-muted-foreground uppercase mb-1">
                          Applications Approved
                        </p>
                        <p className="text-xl font-semibold">
                          {data._count.approvedApplications}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              )}

              {/* ================= EDIT ================= */}
              {activeTab === "edit" && (
                <div className="space-y-5">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Full Name</Label>
                      <Input
                        value={form.fullName}
                        onChange={(e) =>
                          setForm({ ...form, fullName: e.target.value })
                        }
                      />
                    </div>

                    <div>
                      <Label>Email</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) =>
                          setForm({ ...form, email: e.target.value })
                        }
                      />
                    </div>
                  </div>

                  <Button
                    onClick={saveChanges}
                    disabled={!isChanged || isSaving}
                    className="w-full"
                  >
                    {isSaving ? "Saving..." : "Save Changes"}
                  </Button>
                </div>
              )}

              {/* ================= CONTROLS ================= */}
              {activeTab === "controls" && (
                <div className="space-y-6">

                  <div>
                    <p className="text-sm font-medium">Account Status</p>
                    <p className="text-xs text-muted-foreground mb-2">
                      Currently:{" "}
                      <span className={data.active ? "text-green-600" : "text-red-600"}>
                        {data.active ? "Active" : "Inactive"}
                      </span>
                    </p>

                    <Button
                      variant="outline"
                      onClick={toggleActive}
                      disabled={isProcessing}
                      className="w-full"
                    >
                      {data.active ? "Deactivate Account" : "Activate Account"}
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    <p className="text-sm font-medium mb-2">Reset Password</p>
                    <Input
                      type="password"
                      placeholder="Enter new password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                    />
                    <Button
                      onClick={resetPassword}
                      disabled={!newPassword.trim() || isResetting}
                      className="w-full mt-2"
                    >
                      {isResetting ? "Updating..." : "Update Password"}
                    </Button>
                  </div>

                  <Separator />

                  <div>
                    {data.isDeleted ? (
                      <Button
                        onClick={restoreStaff}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        Restore Staff Member
                      </Button>
                    ) : (
                      <Button
                        variant="destructive"
                        onClick={softDelete}
                        disabled={isProcessing}
                        className="w-full"
                      >
                        Soft Delete Staff Member
                      </Button>
                    )}
                  </div>

                </div>
              )}

            </motion.div>
          </AnimatePresence>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminStaffDialog;  