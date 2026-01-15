import { useState, useEffect } from "react";
import { apiFetch } from "@/lib/api";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { User, Save, X, Loader2, Edit2 } from "lucide-react";
import StudentHeader from "@/components/StudentHeader";
import { toast } from "@/hooks/use-toast";
import {
  years,
  semestersByYear,
} from "@/data/railwayData";

const StudentProfile = () => {
  const loadProfile = async () => {
    try {
      const student = await apiFetch("/student/me");
  
      setFormData({
        name: student.fullName,
        enrollmentNo: student.enrollmentNo,
        year: student.year, 
        semester: student.sem,     // ENUM VALUE
        dateOfBirth: student.dateOfBirth ?? "",
        email: student.email,
        phone: student.mobileNumber,
        address: student.address ?? "",
        shift: student.shift,   
      });
    } catch (err) {
      console.error("Failed to load student profile", err);
    }
  };
  
  useEffect(() => {
    loadProfile();
  }, []);
  
  
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    name: "",
    enrollmentNo: "",
    year: "",
    semester: "",
    dateOfBirth: "",
    email: "",
    phone: "",
    address: "",
    shift: "",
  });


  const [errors, setErrors] = useState<Record<string, string>>({});

  const semesters = formData.year ? semestersByYear[formData.year] || [] : [];
  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
  
      // Reset semester if year changes
      if (field === "year") {
        const allowedSemesters = semestersByYear[value] || [];
        if (!allowedSemesters.includes(prev.semester)) {
          updated.semester = "";
        }
      }
  
      return updated;
    });
  
    // Clear field-level error
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };
  
  const handleCancel = () => {
    loadProfile();      // reload original data
    setErrors({});
    setIsEditing(false);
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.year) newErrors.year = "Please select year";
    if (!formData.semester) newErrors.semester = "Please select semester";
    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email";
    }
    if (!formData.phone) newErrors.phone = "Phone number is required";
    else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Please enter a valid 10-digit phone number";
    }
    if (!formData.address.trim()) newErrors.address = "Address is required";
    if (!formData.shift) newErrors.shift = "Please select shift";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
  
    setIsSaving(true);
    try {
      await apiFetch("/student/me", {
        method: "PUT",
        body: JSON.stringify({
          year: formData.year,
          sem: formData.semester,
          shift: formData.shift,
          email: formData.email,
          mobileNumber: formData.phone,
          address: formData.address,
          dateOfBirth: formData.dateOfBirth || null,
        }),
      });
  
      toast({
        title: "Profile Updated",
        description: "Changes saved to database",
      });
  
      setIsEditing(false);
      await loadProfile(); // reload from DB
    } catch (err: any) {
      toast({
        title: "Update failed",
        description: err.message || "Server error",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "";
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />

      <main className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <User className="w-7 h-7 text-primary" />
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Student Profile
            </h1>
          </div>
          {!isEditing && (
            <Button onClick={() => setIsEditing(true)} variant="outline" className="gap-2">
              <Edit2 className="w-4 h-4" />
              Edit Profile
            </Button>
          )}
        </div>

        <Card className="border shadow-sm">
          <CardHeader className="pb-3 border-b bg-muted/30">
            <CardTitle className="text-lg font-heading">Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {/* Read-only Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Name</Label>
                  <Input value={formData.name} disabled className="bg-muted/50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Enrollment Number</Label>
                  <Input value={formData.enrollmentNo} disabled className="bg-muted/50" />
                </div>
              </div>

              {/* Editable Fields */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="year">Year <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.year} 
                    onValueChange={(v) => handleChange("year", v)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="year" className={errors.year ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select year" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {years.map((y) => (
                        <SelectItem key={y} value={y}>{y}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.year && <p className="text-xs text-destructive">{errors.year}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="semester">Semester <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.semester} 
                    onValueChange={(v) => handleChange("semester", v)}
                    disabled={!isEditing || !formData.year}
                  >
                    <SelectTrigger id="semester" className={errors.semester ? "border-destructive" : ""}>
                      <SelectValue placeholder={formData.year ? "Select semester" : "Select year first"} />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      {semesters.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.semester && <p className="text-xs text-destructive">{errors.semester}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Date of Birth</Label>
                  <Input value={formData.dateOfBirth ? formatDate(formData.dateOfBirth) : ""}
                   disabled
                  />

                </div>

                <div className="space-y-2">
                  <Label htmlFor="shift">Shift <span className="text-destructive">*</span></Label>
                  <Select 
                    value={formData.shift} 
                    onValueChange={(v) => handleChange("shift", v)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger id="shift" className={errors.shift ? "border-destructive" : ""}>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent className="bg-card">
                      <SelectItem value="FIRST">First Shift</SelectItem>
                      <SelectItem value="SECOND">Second Shift</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.shift && <p className="text-xs text-destructive">{errors.shift}</p>}
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="font-medium text-foreground mb-4">Contact Information</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email <span className="text-destructive">*</span></Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleChange("email", e.target.value)}
                      disabled={!isEditing}
                      className={errors.email ? "border-destructive" : ""}
                    />
                    {errors.email && <p className="text-xs text-destructive">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number <span className="text-destructive">*</span></Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))}
                      disabled={!isEditing}
                      className={errors.phone ? "border-destructive" : ""}
                    />
                    {errors.phone && <p className="text-xs text-destructive">{errors.phone}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address <span className="text-destructive">*</span></Label>
                  <Textarea
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleChange("address", e.target.value)}
                    disabled={!isEditing}
                    className={`min-h-20 ${errors.address ? "border-destructive" : ""}`}
                  />
                  {errors.address && <p className="text-xs text-destructive">{errors.address}</p>}
                </div>
              </div>

              {/* Action Buttons */}
              {isEditing && (
                <div className="flex gap-4 pt-4 border-t">
                  <Button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="flex-1"
                  >
                    {isSaving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving...
                      </>
                    ) : (
                      <>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Note */}
        <div className="mt-4 p-4 bg-secondary/50 rounded-lg border">
          <p className="text-xs text-muted-foreground">
            <strong className="text-foreground">Note:</strong> Name, Enrollment Number, and Date of Birth 
            cannot be changed. Please contact the administration office for any corrections to these fields.
          </p>
        </div>
      </main>
    </div>
  );
};

export default StudentProfile;
