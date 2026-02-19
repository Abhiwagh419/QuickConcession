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
import { Separator } from "@/components/ui/separator";
import { User, Save, X, Loader2, Edit2, AlertCircle } from "lucide-react";
import StudentHeader from "@/components/StudentHeader";
import { toast } from "@/hooks/use-toast";
import { years, semestersByYear } from "@/data/railwayData";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const StudentProfile = () => {
  const loadProfile = async () => {
    try {
      const student = await apiFetch("/student/me");
      setFormData({
        name: student.fullName,
        enrollmentNo: student.enrollmentNo,
        course: student.course,
        year: student.year,
        semester: student.sem,
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
    course: "",
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
      if (field === "year") {
        const allowedSemesters = semestersByYear[value] || [];
        if (!allowedSemesters.includes(prev.semester)) {
          updated.semester = "";
        }
      }
      return updated;
    });
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const handleCancel = () => {
    loadProfile();
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
      await loadProfile();
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

      <PageWrapper>
        <main className="container mx-auto max-w-3xl px-4 py-8 space-y-6">

          {/* ── Page Header ──────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: EASE_OUT }}
            className="flex flex-wrap items-start justify-between gap-4"
          >
            <div>
              <div className="flex items-center gap-2.5">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                  <User className="h-4 w-4 text-primary-foreground" />
                </div>
                <h1 className="text-xl font-bold tracking-tight text-foreground">
                  Student Profile
                </h1>
              </div>
              <p className="mt-1 pl-10 text-[13px] text-muted-foreground">
                Government Polytechnic Mumbai &mdash; Student Portal
              </p>
            </div>

            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                variant="outline"
                size="sm"
                className="flex items-center gap-2 rounded-lg border-border text-sm font-semibold hover:bg-muted hover:border-primary/40 transition-all duration-150"
              >
                <Edit2 className="h-3.5 w-3.5" />
                Edit Profile
              </Button>
            )}
          </motion.div>

          {/* ── Profile Card ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.38, ease: EASE_OUT, delay: 0.06 }}
          >
            <Card className={`border shadow-sm rounded-xl overflow-hidden transition-all duration-300 ${isEditing ? "ring-1 ring-primary/20" : ""}`}>

              {/* Card Header */}
              <CardHeader className="px-6 py-4 border-b border-border bg-muted/20">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-sm font-semibold text-foreground">
                    Personal Information
                  </CardTitle>
                  {isEditing && (
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                      Editing
                    </span>
                  )}
                </div>
              </CardHeader>

              <CardContent className="px-6 py-6 space-y-8">

                {/* ── Identity (locked) ──────────────────────────────── */}
                <div className="space-y-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground pl-0.5">
                    Identity
                  </p>
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div className="space-y-1.5">
                      <Label className="text-[12px] text-muted-foreground">
                        Full Name
                      </Label>
                      <Input
                        value={formData.name}
                        disabled
                        className="bg-muted/40 text-foreground border-border"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <Label className="text-[12px] text-muted-foreground">
                        Enrollment Number
                      </Label>
                      <Input
                        value={formData.enrollmentNo}
                        disabled
                        className="bg-muted/40 text-foreground border-border"
                      />
                    </div>
                  </div>
                  <div className="space-y-1.5">
                    <Label className="text-[12px] text-muted-foreground">
                      Department / Course
                    </Label>
                    <Input
                      value={formData.course}
                      disabled
                      className="bg-muted/40 text-foreground border-border"
                    />
                  </div>
                </div>

                <Separator />

                {/* ── Academic ───────────────────────────────────────── */}
                <div className="space-y-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground pl-0.5">
                    Academic Details
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Year */}
                    <div className="space-y-1.5">
                      <Label htmlFor="year" className="text-[12px] text-foreground">
                        Year <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.year}
                        onValueChange={(v) => handleChange("year", v)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger
                          id="year"
                          className={`${errors.year ? "border-destructive" : "border-border"} ${!isEditing ? "bg-muted/40" : "bg-background"}`}
                        >
                          <SelectValue placeholder="Select year" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          {years.map((y) => (
                            <SelectItem key={y} value={y}>{y}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.year && (
                        <p className="text-[11px] text-destructive">{errors.year}</p>
                      )}
                    </div>

                    {/* Semester */}
                    <div className="space-y-1.5">
                      <Label htmlFor="semester" className="text-[12px] text-foreground">
                        Semester <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.semester}
                        onValueChange={(v) => handleChange("semester", v)}
                        disabled={!isEditing || !formData.year}
                      >
                        <SelectTrigger
                          id="semester"
                          className={`${errors.semester ? "border-destructive" : "border-border"} ${!isEditing ? "bg-muted/40" : "bg-background"}`}
                        >
                          <SelectValue
                            placeholder={formData.year ? "Select semester" : "Select year first"}
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          {semesters.map((s) => (
                            <SelectItem key={s} value={s}>{s}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.semester && (
                        <p className="text-[11px] text-destructive">{errors.semester}</p>
                      )}
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-1.5">
                      <Label className="text-[12px] text-muted-foreground">
                        Date of Birth
                      </Label>
                      <Input
                        value={formData.dateOfBirth ? formatDate(formData.dateOfBirth) : ""}
                        disabled
                        className="bg-muted/40 text-foreground border-border"
                      />
                    </div>

                    {/* Shift */}
                    <div className="space-y-1.5">
                      <Label htmlFor="shift" className="text-[12px] text-foreground">
                        Shift <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.shift}
                        onValueChange={(v) => handleChange("shift", v)}
                        disabled={!isEditing}
                      >
                        <SelectTrigger
                          id="shift"
                          className={`${errors.shift ? "border-destructive" : "border-border"} ${!isEditing ? "bg-muted/40" : "bg-background"}`}
                        >
                          <SelectValue placeholder="Select shift" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          <SelectItem value="FIRST">First Shift</SelectItem>
                          <SelectItem value="SECOND">Second Shift</SelectItem>
                        </SelectContent>
                      </Select>
                      {errors.shift && (
                        <p className="text-[11px] text-destructive">{errors.shift}</p>
                      )}
                    </div>
                  </div>
                </div>

                <Separator />

                {/* ── Contact ────────────────────────────────────────── */}
                <div className="space-y-4">
                  <p className="text-[11px] font-semibold uppercase tracking-widest text-muted-foreground pl-0.5">
                    Contact Information
                  </p>

                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    {/* Email */}
                    <div className="space-y-1.5">
                      <Label htmlFor="email" className="text-[12px] text-foreground">
                        Email <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleChange("email", e.target.value)}
                        disabled={!isEditing}
                        className={`${errors.email ? "border-destructive" : "border-border"} ${!isEditing ? "bg-muted/40" : "bg-background"}`}
                      />
                      {errors.email && (
                        <p className="text-[11px] text-destructive">{errors.email}</p>
                      )}
                    </div>

                    {/* Phone */}
                    <div className="space-y-1.5">
                      <Label htmlFor="phone" className="text-[12px] text-foreground">
                        Phone Number <span className="text-destructive">*</span>
                      </Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          handleChange("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
                        }
                        disabled={!isEditing}
                        className={`${errors.phone ? "border-destructive" : "border-border"} ${!isEditing ? "bg-muted/40" : "bg-background"}`}
                      />
                      {errors.phone && (
                        <p className="text-[11px] text-destructive">{errors.phone}</p>
                      )}
                    </div>
                  </div>

                  {/* Address */}
                  <div className="space-y-1.5">
                    <Label htmlFor="address" className="text-[12px] text-foreground">
                      Address <span className="text-destructive">*</span>
                    </Label>
                    <Textarea
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleChange("address", e.target.value)}
                      disabled={!isEditing}
                      className={`min-h-20 resize-none ${errors.address ? "border-destructive" : "border-border"} ${!isEditing ? "bg-muted/40" : "bg-background"}`}
                    />
                    {errors.address && (
                      <p className="text-[11px] text-destructive">{errors.address}</p>
                    )}
                  </div>
                </div>

                {/* ── Action Buttons ─────────────────────────────────── */}
                {isEditing && (
                  <>
                    <Separator />
                    <div className="flex flex-col gap-3 sm:flex-row">
                      <Button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="flex-1 h-9 rounded-lg font-semibold text-sm"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Saving…
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
                        className="flex-1 h-9 rounded-lg font-semibold text-sm border-border hover:bg-muted"
                      >
                        <X className="mr-2 h-4 w-4" />
                        Cancel
                      </Button>
                    </div>
                  </>
                )}

              </CardContent>
            </Card>
          </motion.div>

          {/* ── Notice Panel ─────────────────────────────────────────── */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.38, ease: EASE_OUT, delay: 0.12 }}
          >
            <div className="flex items-start gap-2.5 rounded-xl border border-border bg-muted/40 px-4 py-3.5">
              <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5 text-muted-foreground" />
              <p className="text-[12px] leading-relaxed text-muted-foreground">
                <span className="font-semibold text-foreground">Note:</span>{" "}
                Name, Enrollment Number, and Date of Birth cannot be changed.
                Please contact the administration office for any corrections to
                these fields.
              </p>
            </div>
          </motion.div>

        </main>
      </PageWrapper>
    </div>
  );
};

export default StudentProfile;