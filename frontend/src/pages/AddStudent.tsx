import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/AdminHeader";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { UserPlus, ArrowLeft, Loader2, KeyRound } from "lucide-react";
import { apiFetch } from "@/lib/api";

const AddStudent = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    enrollmentNo: "",
    fullName: "",
    email: "",
    mobileNumber: "",
    course: "",
    year: "FY",
    sem: "SEM_I",
    shift: "FIRST",
    password: "",
    dateOfBirth: "",
    address: "",
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const generatePassword = () => {
    const random = Math.random().toString(36).slice(-8);
    setForm({ ...form, password: random });
  };

  const validateForm = () => {
    if (!form.enrollmentNo || !form.fullName || !form.email || !form.password) {
      toast({
        title: "Missing Required Fields",
        description: "Please fill all mandatory fields.",
        variant: "destructive",
      });
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      await apiFetch("/admin/students", {
        method: "POST",
        body: JSON.stringify(form),
      });

      toast({
        title: "Student Created",
        description: "Student record added successfully.",
      });

      navigate("/admin/students");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to create student",
        variant: "destructive",
      });
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-black/[0.02]">
      <AdminHeader />

      <PageWrapper>
        <main className="container mx-auto px-4 py-8 max-w-5xl">
          <div className="flex justify-between items-center mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate("/admin/students")}
              className="text-black/60 hover:text-black hover:bg-black/[0.04]"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Students
            </Button>

            <Button
              variant="outline"
              onClick={() => navigate("/admin/students/import")}
              className="border-black/15 text-black/70 hover:border-black/30 hover:bg-black/[0.02]"
            >
              Bulk Import CSV
            </Button>
          </div>

          <Card className="border-black/[0.08]">
            <CardHeader className="border-b border-black/[0.06]">
              <CardTitle className="flex items-center gap-2.5 text-[20px] font-semibold tracking-[-0.02em] text-[#171717]">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#171717]">
                  <UserPlus className="w-4 h-4 text-white" />
                </div>
                Add New Student
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                
                <div className="bg-black/[0.02] border border-black/[0.06] p-6 rounded-2xl space-y-6">
                  <h3 className="text-[15px] font-semibold text-black/80">Personal Details</h3>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <Label>Enrollment Number *</Label>
                      <Input
                        value={form.enrollmentNo}
                        onChange={(e) =>
                          handleChange("enrollmentNo", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Full Name *</Label>
                      <Input
                        value={form.fullName}
                        onChange={(e) =>
                          handleChange("fullName", e.target.value)
                        }
                        required
                      />
                    </div>

                    <div>
                      <Label>Email *</Label>
                      <Input
                        type="email"
                        value={form.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label>Mobile Number</Label>
                      <Input
                        value={form.mobileNumber}
                        onChange={(e) =>
                          handleChange("mobileNumber", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Date of Birth</Label>
                      <Input
                        type="date"
                        value={form.dateOfBirth}
                        onChange={(e) =>
                          handleChange("dateOfBirth", e.target.value)
                        }
                      />
                    </div>

                    <div>
                      <Label>Address</Label>
                      <Input
                        value={form.address}
                        onChange={(e) =>
                          handleChange("address", e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>

                
                <div className="bg-black/[0.02] border border-black/[0.06] p-6 rounded-2xl space-y-6">
                  <h3 className="text-[15px] font-semibold text-black/80">Academic Details</h3>

                  <div className="grid md:grid-cols-3 gap-6">
                    <div>
                      <Label>Course</Label>
                      <Input
                        value={form.course}
                        onChange={(e) => handleChange("course", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Year</Label>
                      <Select
                        value={form.year}
                        onValueChange={(val) => handleChange("year", val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FY">FY</SelectItem>
                          <SelectItem value="SY">SY</SelectItem>
                          <SelectItem value="TY">TY</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Semester</Label>
                      <Select
                        value={form.sem}
                        onValueChange={(val) => handleChange("sem", val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="SEM_I">SEM I</SelectItem>
                          <SelectItem value="SEM_II">SEM II</SelectItem>
                          <SelectItem value="SEM_III">SEM III</SelectItem>
                          <SelectItem value="SEM_IV">SEM IV</SelectItem>
                          <SelectItem value="SEM_V">SEM V</SelectItem>
                          <SelectItem value="SEM_VI">SEM VI</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label>Shift</Label>
                      <Select
                        value={form.shift}
                        onValueChange={(val) => handleChange("shift", val)}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="FIRST">FIRST</SelectItem>
                          <SelectItem value="SECOND">SECOND</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                
                <div className="bg-black/[0.02] border border-black/[0.06] p-6 rounded-2xl space-y-6">
                  <h3 className="text-[15px] font-semibold text-black/80">Account Setup</h3>

                  <div className="flex gap-4 items-end">
                    <div className="flex-1">
                      <Label>Initial Password *</Label>
                      <Input
                        type="text"
                        value={form.password}
                        onChange={(e) =>
                          handleChange("password", e.target.value)
                        }
                        required
                      />
                    </div>

                    <Button
                      type="button"
                      variant="outline"
                      onClick={generatePassword}
                    >
                      <KeyRound className="w-4 h-4 mr-2" />
                      Generate
                    </Button>
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-[15px] font-medium bg-[#171717] text-white hover:bg-[#171717] hover:opacity-90 transition-opacity"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating Student...
                    </>
                  ) : (
                    "Create Student"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </main>
      </PageWrapper>
    </div>
  );
};

export default AddStudent;
