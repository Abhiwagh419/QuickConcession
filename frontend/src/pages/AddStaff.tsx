import { useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "@/components/AdminHeader";
import PageWrapper from "@/components/PageWrapper";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { ArrowLeft, Loader2, UserPlus } from "lucide-react";
import { apiFetch } from "@/lib/api";

const AddStaff = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!form.fullName || !form.email || !form.password) {
      toast({
        title: "Missing Fields",
        description: "All fields are required.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      await apiFetch("/admin/staff", {
        method: "POST",
        body: JSON.stringify(form),
      });

      toast({
        title: "Staff Created",
        description: "Staff member added successfully.",
      });

      navigate("/admin/staff");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message,
        variant: "destructive",
      });
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <AdminHeader />

      <PageWrapper>
        <main className="container mx-auto px-4 py-8 max-w-3xl">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => navigate("/admin/staff")}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Staff
          </Button>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-xl">
                <UserPlus className="w-5 h-5 text-primary" />
                Add Staff Member
              </CardTitle>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label>Full Name</Label>
                  <Input
                    value={form.fullName}
                    onChange={(e) => handleChange("fullName", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => handleChange("email", e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label>Password</Label>
                  <Input
                    type="text"
                    value={form.password}
                    onChange={(e) => handleChange("password", e.target.value)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="animate-spin w-4 h-4 mr-2" />
                      Creating...
                    </>
                  ) : (
                    "Create Staff"
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

export default AddStaff;
