import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Edit, Trash2, RotateCcw } from "lucide-react";
import { apiFetch } from "@/lib/api";
import AdminStaffDialog from "@/components/AdminStaffDialog";
import { useNavigate } from "react-router-dom";

interface Staff {
  id: number;
  fullName: string;
  email: string;
  role: "STAFF" | "ADMIN";
  createdAt: string;
  active: boolean;
  isDeleted: boolean;
}

const AdminStaff = () => {
  const [staffList, setStaffList] = useState<Staff[]>([]);
  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const navigate = useNavigate();
  // ================= LOAD STAFF =================

  const loadStaff = async () => {
    try {
      const data = await apiFetch(
        showDeleted ? "/admin/staff?deleted=true" : "/admin/staff",
      );
      setStaffList(data);
    } catch (err) {
      console.error("Failed to load staff:", err);
    }
  };

  useEffect(() => {
    loadStaff();
  }, [showDeleted]);

  // ================= OPEN DETAILS =================

  const openStaffDetails = async (id: number) => {
    try {
      const fullData = await apiFetch(`/admin/staff/${id}`);
      setSelectedStaff(fullData);
      setDialogOpen(true);
    } catch (err) {
      console.error("Failed to fetch staff details:", err);
    }
  };

  // ================= ACTIONS =================

  const handleToggleActive = async (id: number) => {
    await apiFetch(`/admin/staff/${id}/toggle`, { method: "PATCH" });
    loadStaff();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this staff member?")) return;
    await apiFetch(`/admin/staff/${id}/delete`, { method: "PATCH" });
    loadStaff();
  };

  const handleRestore = async (id: number) => {
    await apiFetch(`/admin/staff/${id}/restore`, { method: "PATCH" });
    loadStaff();
  };

  // ================= FILTER =================

  const filteredStaff = staffList.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.email.toLowerCase().includes(search.toLowerCase()),
  );

  // ================= UI =================

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <PageWrapper>
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          {/* TITLE */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Staff Management
            </h1>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleted(!showDeleted)}
              >
                {showDeleted ? "View Active Staff" : "View Deleted Staff"}
              </Button>

              <Button onClick={() => navigate("/admin/staff/add")}>
                Add Staff
              </Button>

              <Button
                variant="secondary"
                onClick={() => navigate("/admin/staff/import")}
              >
                Import CSV
              </Button>
            </div>
          </div>

          {/* SEARCH */}
          <Card className="mb-6">
            <CardContent className="p-4 flex items-center gap-4">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or email..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* TABLE */}
          <Card>
            <CardHeader>
              <CardTitle>
                {showDeleted ? "Deleted Staff" : "All Staff"}
              </CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="py-3">Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStaff.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="py-10 text-center text-muted-foreground"
                      >
                        No staff members found.
                      </td>
                    </tr>
                  ) : (
                    filteredStaff.map((staff) => (
                      <tr key={staff.id} className="border-b hover:bg-muted/50">
                        {/* NAME — click to open dialog */}
                        <td
                          className="py-3 cursor-pointer hover:text-primary font-medium"
                          onClick={() => openStaffDetails(staff.id)}
                        >
                          {staff.fullName}
                        </td>

                        <td>{staff.email}</td>

                        <td>
                          <Badge variant="secondary">{staff.role}</Badge>
                        </td>

                        <td className="text-muted-foreground">
                          {new Date(staff.createdAt).toLocaleDateString(
                            "en-IN",
                          )}
                        </td>

                        <td>
                          {!showDeleted && (
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleToggleActive(staff.id);
                              }}
                              className={`px-3 py-1 rounded text-xs font-medium ${
                                staff.active
                                  ? "bg-green-100 text-green-700"
                                  : "bg-red-100 text-red-700"
                              }`}
                            >
                              {staff.active ? "Active" : "Inactive"}
                            </button>
                          )}
                          {showDeleted && <Badge>Deleted</Badge>}
                        </td>

                        <td className="text-right space-x-2">
                          {!showDeleted ? (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openStaffDetails(staff.id);
                                }}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDelete(staff.id);
                                }}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </>
                          ) : (
                            <Button
                              size="sm"
                              variant="secondary"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRestore(staff.id);
                              }}
                            >
                              <RotateCcw className="w-4 h-4 mr-1" />
                              Restore
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

          {/* DIALOG */}
          <AdminStaffDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            data={selectedStaff}
            refresh={async () => {
              await loadStaff();
              if (selectedStaff) {
                const full = await apiFetch(`/admin/staff/${selectedStaff.id}`);
                setSelectedStaff(full);
              }
            }}
          />
        </main>
      </PageWrapper>
    </div>
  );
};

export default AdminStaff;
