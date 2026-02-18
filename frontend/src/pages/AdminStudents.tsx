import { useEffect, useState } from "react";
import AdminHeader from "@/components/AdminHeader";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Users, Search, Plus, Edit, Trash2, RotateCcw } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "@/lib/api";
import AdminStudentDialog from "@/components/AdminStudentDialog";

interface Student {
  id: number;
  enrollmentNo: string;
  fullName: string;
  course: string;
  sem: string;
  shift: string;
  active: boolean;
}

const AdminStudents = () => {
  const navigate = useNavigate();
  const [students, setStudents] = useState<Student[]>([]);
  const [search, setSearch] = useState("");
  const [showDeleted, setShowDeleted] = useState(false);
const [openDialog, setOpenDialog] = useState(false);
const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
const [detailsLoading, setDetailsLoading] = useState(false);
  const loadStudents = async () => {
    try {
      const data = await apiFetch(
        showDeleted
          ? "/admin/students?deleted=true"
          : "/admin/students"
      );
      setStudents(data);
    } catch (err: any) {
      console.error("Failed to load students:", err);
    }
  };

const openStudentDetails = async (id: number) => {
  try {
    const data = await apiFetch(`/admin/students/${id}/full`);
    setSelectedStudent(data);
    setOpenDialog(true);
  } catch (err) {
    console.error("Failed to fetch details");
  }
};

  useEffect(() => {
    loadStudents();
  }, [showDeleted]);

  const handleToggleActive = async (id: number) => {
    try {
      await apiFetch(`/admin/students/${id}/toggle`, {
        method: "PATCH",
      });
      loadStudents();
    } catch (err) {
      console.error("Toggle failed", err);
    }
  };

  const handleDelete = async (id: number) => {
    const confirmDelete = confirm(
      "Are you sure you want to delete this student?"
    );
    if (!confirmDelete) return;

    try {
      await apiFetch(`/admin/students/${id}/delete`, {
        method: "PATCH",
      });
      loadStudents();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleRestore = async (id: number) => {
    try {
      await apiFetch(`/admin/students/${id}/restore`, {
        method: "PATCH",
      });
      loadStudents();
    } catch (err) {
      console.error("Restore failed", err);
    }
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <PageWrapper>
        <main className="container mx-auto px-4 py-6 max-w-7xl">

          {/* Title Section */}
          <div className="flex items-center justify-between mb-6">
            <h1 className="font-heading text-2xl font-bold flex items-center gap-2">
              <Users className="w-6 h-6 text-primary" />
              Student Management
            </h1>

            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={() => setShowDeleted(!showDeleted)}
              >
                {showDeleted ? "View Active Students" : "View Deleted Students"}
              </Button>

              <Button
                onClick={() => navigate("/admin/students/add")}
                className="btn-primary-gradient"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>

          {/* Search */}
          <Card className="mb-6">
            <CardContent className="p-4 flex items-center gap-4">
              <Search className="w-5 h-5 text-muted-foreground" />
              <Input
                placeholder="Search by name or enrollment number..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </CardContent>
          </Card>

          {/* Table */}
          <Card>
            <CardHeader>
              <CardTitle>
                {showDeleted ? "Deleted Students" : "All Students"}
              </CardTitle>
            </CardHeader>

            <CardContent className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="border-b">
                  <tr className="text-left">
                    <th className="py-3">Enrollment</th>
                    <th>Name</th>
                    <th>Course</th>
                    <th>Semester</th>
                    <th>Shift</th>
                    <th>Status</th>
                    <th className="text-right">Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredStudents.map((student) => (
                    <tr
  key={student.id}
  onClick={() => openStudentDetails(student.id)}
  className="border-b hover:bg-muted/50 cursor-pointer"
>
                      <td className="py-3">{student.enrollmentNo}</td>
                      <td>{student.fullName}</td>
                      <td>{student.course}</td>
                      <td>{student.sem}</td>
                      <td>{student.shift}</td>

                      <td>
                        {!showDeleted && (
                          <button
                            onClick={() => handleToggleActive(student.id)}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              student.active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {student.active ? "Active" : "Inactive"}
                          </button>
                        )}
                        {showDeleted && (
                          <Badge className="bg-muted text-muted-foreground">
                            Deleted
                          </Badge>
                        )}
                      </td>

                      <td className="text-right space-x-2">
                        {!showDeleted ? (
                          <>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                navigate(`/admin/students/edit/${student.id}`)
                              }
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={() => handleDelete(student.id)}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </>
                        ) : (
                          <Button
                            size="sm"
                            variant="secondary"
                            onClick={() => handleRestore(student.id)}
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Restore
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}

                  {filteredStudents.length === 0 && (
                    <tr>
                      <td
                        colSpan={7}
                        className="text-center py-6 text-muted-foreground"
                      >
                        No students found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </CardContent>
          </Card>

<AdminStudentDialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  data={selectedStudent}
  refresh={loadStudents}
/>

        </main>
      </PageWrapper>
    </div>
  );
};

export default AdminStudents;
