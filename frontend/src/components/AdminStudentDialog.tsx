import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, GraduationCap, Calendar } from "lucide-react";
import { apiFetch } from "@/lib/api";

interface Props {
  open: boolean;
  onClose: () => void;
  data: any | null;
  refresh: () => void;
}

const AdminStudentDialog = ({ open, onClose, data, refresh }: Props) => {
  if (!data) return null;

  const toggleActive = async () => {
    await apiFetch(`/admin/students/${data.id}/toggle`, {
      method: "PATCH",
    });
    refresh();
  };

  const deleteStudent = async () => {
    const confirmDelete = confirm("Are you sure?");
    if (!confirmDelete) return;

    await apiFetch(`/admin/students/${data.id}/delete`, {
      method: "PATCH",
    });

    refresh();
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl">
        <DialogHeader>
          <DialogTitle>Admin Student Control Panel</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="profile">
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="applications">Applications</TabsTrigger>
            <TabsTrigger value="controls">Controls</TabsTrigger>
          </TabsList>

          {/* PROFILE TAB */}
          <TabsContent value="profile">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <p className="text-lg font-semibold flex items-center gap-2">
                  <User className="w-4 h-4" />
                  {data.fullName}
                </p>

                <p><strong>Enrollment:</strong> {data.enrollmentNo}</p>
                <p><strong>Email:</strong> {data.email}</p>
                <p><strong>Mobile:</strong> {data.mobileNumber}</p>

                <Separator />

                <p><strong>Course:</strong> {data.course}</p>
                <p><strong>Year:</strong> {data.year}</p>
                <p><strong>Semester:</strong> {data.sem}</p>
                <p><strong>Shift:</strong> {data.shift}</p>

                <Badge className={data.active ? "bg-green-500" : "bg-red-500"}>
                  {data.active ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </TabsContent>

          {/* APPLICATION TAB */}
          <TabsContent value="applications">
            <div className="space-y-3 max-h-[400px] overflow-y-auto">
              {data.applications?.length === 0 && (
                <p className="text-muted-foreground text-sm">
                  No applications found.
                </p>
              )}

              {data.applications?.map((app: any) => (
                <div
                  key={app.id}
                  className="border rounded-lg p-4 hover:shadow-md transition"
                >
                  <div className="flex justify-between">
                    <span className="font-medium">
                      {app.fromStation} → {app.toStation}
                    </span>

                    <Badge>
                      {app.status}
                    </Badge>
                  </div>

                  <p className="text-sm text-muted-foreground mt-1">
                    Applied:{" "}
                    {new Date(app.appliedAt).toLocaleDateString("en-IN")}
                  </p>

                  {app.status === "REJECTED" && (
                    <p className="text-destructive text-sm">
                      Reason: {app.rejectionReason}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </TabsContent>

          {/* CONTROL TAB */}
          <TabsContent value="controls">
            <div className="space-y-4">
              <Button
                variant="outline"
                onClick={toggleActive}
                className="w-full"
              >
                {data.active ? "Deactivate Account" : "Activate Account"}
              </Button>

              <Button
                variant="destructive"
                onClick={deleteStudent}
                className="w-full"
              >
                Soft Delete Student
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default AdminStudentDialog;
