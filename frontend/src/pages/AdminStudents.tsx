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

  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const loadStudents = async () => {
    try {
      const data = await apiFetch(
        showDeleted ? "/admin/students?deleted=true" : "/admin/students",
      );
      setStudents(data);
    } catch (err) {
      console.error("Failed to load students:", err);
    }
  };

  useEffect(() => {
    loadStudents();
  }, [showDeleted]);

  const openStudentDetails = async (id: number) => {
    try {
      const fullData = await apiFetch(`/admin/students/${id}/full`);
      setSelectedStudent(fullData);
      setDialogOpen(true);
    } catch (err) {
      console.error("Failed to fetch student details:", err);
    }
  };

  const handleToggleActive = async (id: number) => {
    await apiFetch(`/admin/students/${id}/toggle`, {
      method: "PATCH",
    });
    loadStudents();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this student?")) return;

    await apiFetch(`/admin/students/${id}/delete`, {
      method: "PATCH",
    });
    loadStudents();
  };

  const handleRestore = async (id: number) => {
    await apiFetch(`/admin/students/${id}/restore`, {
      method: "PATCH",
    });
    loadStudents();
  };

  const filteredStudents = students.filter(
    (s) =>
      s.fullName.toLowerCase().includes(search.toLowerCase()) ||
      s.enrollmentNo.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <PageWrapper>
        <main className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-[22px] font-semibold tracking-[-0.02em] flex items-center gap-2">
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

              <Button onClick={() => navigate("/admin/students/add")}>
                <Plus className="w-4 h-4 mr-2" />
                Add Student
              </Button>
            </div>
          </div>

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
                    <tr key={student.id} className="border-b hover:bg-muted/50">
                      <td className="py-3">{student.enrollmentNo}</td>

                      <td
                        onClick={() => openStudentDetails(student.id)}
                        className="cursor-pointer hover:text-primary font-medium"
                      >
                        {student.fullName}
                      </td>

                      <td>{student.course}</td>
                      <td>{student.sem}</td>
                      <td>{student.shift}</td>

                      <td>
                        {!showDeleted && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleActive(student.id);
                            }}
                            className={`px-3 py-1 rounded text-xs font-medium ${
                              student.active
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                          >
                            {student.active ? "Active" : "Inactive"}
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
                                openStudentDetails(student.id);
                              }}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>

                            <Button
                              size="sm"
                              variant="destructive"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDelete(student.id);
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
                              handleRestore(student.id);
                            }}
                          >
                            <RotateCcw className="w-4 h-4 mr-1" />
                            Restore
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>

          <AdminStudentDialog
            open={dialogOpen}
            onClose={() => setDialogOpen(false)}
            data={selectedStudent}
            refresh={async () => {
              await loadStudents();

              if (selectedStudent) {
                const full = await apiFetch(
                  `/admin/students/${selectedStudent.id}/full`,
                );
                setSelectedStudent(full);
              }
            }}
          />
        </main>
      </PageWrapper>
    </div>
  );
};

export default AdminStudents;
