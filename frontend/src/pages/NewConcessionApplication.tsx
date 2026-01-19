import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Train, AlertTriangle, Loader2 } from "lucide-react";
import StudentHeader from "@/components/StudentHeader";
import { toast } from "@/hooks/use-toast";
import {
  railwayLines,
  stationsByLine,
  concessionClasses,
  concessionPeriods,
} from "@/data/railwayData";
import { apiFetch } from "@/lib/api";
import { useEffect } from "react";
import PageWrapper from "@/components/PageWrapper";

const NewConcessionApplication = () => {
  useEffect(() => {
    const loadStudent = async () => {
      try {
        const me = await apiFetch("/student/me");
        setStudent(me);
      } catch (err) {
        console.error("Failed to load student", err);
      }
    };

    loadStudent();
  }, []);

  const navigate = useNavigate();
  const [student, setStudent] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    travelClass: "",
    period: "",
    fromLine: "",
    fromStation: "",
    toLine: "",
    toStation: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const fromStations = formData.fromLine
    ? stationsByLine[formData.fromLine] || []
    : [];
  const toStations = formData.toLine
    ? stationsByLine[formData.toLine] || []
    : [];

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };

      if (field === "fromLine") {
        updated.fromStation = "";
      }
      if (field === "toLine") {
        updated.toStation = "";
      }

      return updated;
    });

    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.travelClass) newErrors.travelClass = "Please select a class";
    if (!formData.period) newErrors.period = "Please select a period";
    if (!formData.fromLine) newErrors.fromLine = "Please select departure line";
    if (!formData.fromStation)
      newErrors.fromStation = "Please select departure station";
    if (!formData.toLine) newErrors.toLine = "Please select arrival line";
    if (!formData.toStation)
      newErrors.toStation = "Please select arrival station";
    if (
      formData.fromStation &&
      formData.toStation &&
      formData.fromStation === formData.toStation
    ) {
      newErrors.toStation = "Departure and arrival stations cannot be the same";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setIsSubmitting(true);

    try {
      await apiFetch("/concession/apply", {
        method: "POST",
        body: JSON.stringify({
          fromLine: formData.fromLine,
          toLine: formData.toLine,
          fromStation: formData.fromStation,
          toStation: formData.toStation,
          travelClass: formData.travelClass,
          duration: formData.period,
        }),
      });

      toast({
        title: "Application Submitted",
        description:
          "Your railway concession application has been submitted successfully.",
      });

      navigate("/student/railway");
    } catch (err: any) {
      toast({
        title: "Submission Failed",
        description: err.message || "Could not submit application",
        variant: "destructive",
      });
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate("/student/railway");
  };

  const getLineName = (lineId: string) => {
    return railwayLines.find((l) => l.id === lineId)?.name || lineId;
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-background">
        <StudentHeader />
        <div className="p-6">Loading student information…</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <StudentHeader />

      <PageWrapper>
        <main className="container mx-auto px-4 py-6 max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <Train className="w-7 h-7 text-primary" />
            <h1 className="font-heading text-2xl font-bold text-foreground">
              Apply for Railway Concession
            </h1>
          </div>

          {/* Student Info Card */}
          <Card className="border shadow-sm mb-6 bg-secondary/30">
            <CardContent className="pt-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Enrollment No
                  </p>
                  <p className="font-medium">{student.enrollmentNo}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Name
                  </p>
                  <p className="font-medium">{student.fullName}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Department
                  </p>
                  <p className="font-medium">{student.course}</p>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground uppercase">
                    Year/Semester
                  </p>
                  <p className="font-medium">
                    {student.year} / {student.sem}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Application Form */}
          <Card className="border shadow-sm">
            <CardHeader className="pb-3 border-b bg-muted/30">
              <CardTitle className="text-lg font-heading">
                Concession Details
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Class and Period Row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="travelClass">
                      Class <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.travelClass}
                      onValueChange={(v) => handleChange("travelClass", v)}
                    >
                      <SelectTrigger
                        id="travelClass"
                        className={
                          errors.travelClass ? "border-destructive" : ""
                        }
                      >
                        <SelectValue placeholder="Select class" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {concessionClasses.map((cls) => (
                          <SelectItem key={cls} value={cls}>
                            {cls}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.travelClass && (
                      <p className="text-xs text-destructive">
                        {errors.travelClass}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="period">
                      Period <span className="text-destructive">*</span>
                    </Label>
                    <Select
                      value={formData.period}
                      onValueChange={(v) => handleChange("period", v)}
                    >
                      <SelectTrigger
                        id="period"
                        className={errors.period ? "border-destructive" : ""}
                      >
                        <SelectValue placeholder="Select period" />
                      </SelectTrigger>
                      <SelectContent className="bg-card">
                        {concessionPeriods.map((p) => (
                          <SelectItem key={p} value={p}>
                            {p}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {errors.period && (
                      <p className="text-xs text-destructive">
                        {errors.period}
                      </p>
                    )}
                  </div>
                </div>

                {/* From Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground border-b pb-2">
                    Departure Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fromLine">
                        From Line <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.fromLine}
                        onValueChange={(v) => handleChange("fromLine", v)}
                      >
                        <SelectTrigger
                          id="fromLine"
                          className={
                            errors.fromLine ? "border-destructive" : ""
                          }
                        >
                          <SelectValue placeholder="Select railway line" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          {railwayLines.map((line) => (
                            <SelectItem key={line.id} value={line.id}>
                              {line.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.fromLine && (
                        <p className="text-xs text-destructive">
                          {errors.fromLine}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fromStation">
                        From Station <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.fromStation}
                        onValueChange={(v) => handleChange("fromStation", v)}
                        disabled={!formData.fromLine}
                      >
                        <SelectTrigger
                          id="fromStation"
                          className={
                            errors.fromStation ? "border-destructive" : ""
                          }
                        >
                          <SelectValue
                            placeholder={
                              formData.fromLine
                                ? "Select station"
                                : "Select line first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-card max-h-60">
                          {fromStations.map((station) => (
                            <SelectItem key={station} value={station}>
                              {station}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.fromStation && (
                        <p className="text-xs text-destructive">
                          {errors.fromStation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* To Section */}
                <div className="space-y-4">
                  <h3 className="font-medium text-foreground border-b pb-2">
                    Arrival Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="toLine">
                        To Line <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.toLine}
                        onValueChange={(v) => handleChange("toLine", v)}
                      >
                        <SelectTrigger
                          id="toLine"
                          className={errors.toLine ? "border-destructive" : ""}
                        >
                          <SelectValue placeholder="Select railway line" />
                        </SelectTrigger>
                        <SelectContent className="bg-card">
                          {railwayLines.map((line) => (
                            <SelectItem key={line.id} value={line.id}>
                              {line.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.toLine && (
                        <p className="text-xs text-destructive">
                          {errors.toLine}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="toStation">
                        To Station <span className="text-destructive">*</span>
                      </Label>
                      <Select
                        value={formData.toStation}
                        onValueChange={(v) => handleChange("toStation", v)}
                        disabled={!formData.toLine}
                      >
                        <SelectTrigger
                          id="toStation"
                          className={
                            errors.toStation ? "border-destructive" : ""
                          }
                        >
                          <SelectValue
                            placeholder={
                              formData.toLine
                                ? "Select station"
                                : "Select line first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent className="bg-card max-h-60">
                          {toStations.map((station) => (
                            <SelectItem key={station} value={station}>
                              {station}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.toStation && (
                        <p className="text-xs text-destructive">
                          {errors.toStation}
                        </p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Summary */}
                {formData.fromStation && formData.toStation && (
                  <div className="p-4 bg-secondary/50 rounded-lg border">
                    <p className="text-sm font-medium text-foreground mb-1">
                      Route Summary:
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formData.fromStation} ({getLineName(formData.fromLine)})
                      → {formData.toStation} ({getLineName(formData.toLine)})
                    </p>
                    {formData.travelClass && formData.period && (
                      <p className="text-sm text-muted-foreground mt-1">
                        {formData.travelClass} • {formData.period} Pass
                      </p>
                    )}
                  </div>
                )}

                {/* Notes */}
                <div className="p-4 bg-warning/10 border border-warning/30 rounded-lg flex gap-3">
                  <AlertTriangle className="w-5 h-5 text-warning flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-foreground">
                    <strong>Important:</strong> Applications may be rejected if
                    incorrect information is provided. Please verify all details
                    before submitting.
                  </p>
                </div>

                {/* Buttons */}
                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex-1"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Submitting...
                      </>
                    ) : (
                      "Submit Application"
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleCancel}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </main>
      </PageWrapper>
    </div>
  );
};

export default NewConcessionApplication;
