import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/AdminHeader";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { UserPlus, ArrowLeft, Loader2 } from "lucide-react";
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

  const handleChange = (e: any) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
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
    <div className="min-h-screen bg-background">
      <AdminHeader />

      <PageWrapper>
        <main className="container mx-auto px-4 py-6 max-w-3xl">

          <Button
            variant="ghost"
            className="mb-4"
            onClick={() => navigate("/admin/students")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Students
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-primary" />
                Add New Student
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">

                {/* Enrollment */}
                <div className="space-y-2">
                  <Label>Enrollment Number</Label>
                  <Input
                    name="enrollmentNo"
                    value={form.enrollmentNo}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Full Name */}
                <div className="space-y-2">
                  <Label>Full Name</Label>
                  <Input
                    name="fullName"
                    value={form.fullName}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Email */}
                <div className="space-y-2">
                  <Label>Email</Label>
                  <Input
                    type="email"
                    name="email"
                    value={form.email}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Mobile */}
                <div className="space-y-2">
                  <Label>Mobile Number</Label>
                  <Input
                    name="mobileNumber"
                    value={form.mobileNumber}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Course */}
                <div className="space-y-2">
                  <Label>Course</Label>
                  <Input
                    name="course"
                    value={form.course}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* Year */}
                <div className="space-y-2">
                  <Label>Year</Label>
                  <select
                    name="year"
                    value={form.year}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 bg-background"
                  >
                    <option value="FY">FY</option>
                    <option value="SY">SY</option>
                    <option value="TY">TY</option>
                  </select>
                </div>

                {/* Semester */}
                <div className="space-y-2">
                  <Label>Semester</Label>
                  <select
                    name="sem"
                    value={form.sem}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 bg-background"
                  >
                    <option value="SEM_I">SEM I</option>
                    <option value="SEM_II">SEM II</option>
                    <option value="SEM_III">SEM III</option>
                    <option value="SEM_IV">SEM IV</option>
                    <option value="SEM_V">SEM V</option>
                    <option value="SEM_VI">SEM VI</option>
                  </select>
                </div>

                {/* Shift */}
                <div className="space-y-2">
                  <Label>Shift</Label>
                  <select
                    name="shift"
                    value={form.shift}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 bg-background"
                  >
                    <option value="FIRST">FIRST</option>
                    <option value="SECOND">SECOND</option>
                  </select>
                </div>

                {/* Password */}
                <div className="space-y-2">
                  <Label>Initial Password</Label>
                  <Input
                    type="password"
                    name="password"
                    value={form.password}
                    onChange={handleChange}
                    required
                  />
                </div>

                {/* DOB */}
                <div className="space-y-2">
                  <Label>Date of Birth</Label>
                  <Input
                    type="date"
                    name="dateOfBirth"
                    value={form.dateOfBirth}
                    onChange={handleChange}
                  />
                </div>

                {/* Address */}
                <div className="space-y-2">
                  <Label>Address</Label>
                  <Input
                    name="address"
                    value={form.address}
                    onChange={handleChange}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full btn-primary-gradient"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin mr-2" />
                      Creating...
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
