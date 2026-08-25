import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Train,
  AlertTriangle,
  Loader2,
  MapPin,
  ArrowRight,
} from "lucide-react";
import StudentHeader from "@/components/StudentHeader";
import { toast } from "@/hooks/use-toast";
import {
  railwayLines,
  stationsByLine,
  concessionClasses,
  concessionPeriods,
} from "@/data/railwayData";
import { apiFetch } from "@/lib/api";
import PageWrapper from "@/components/PageWrapper";
import { motion } from "framer-motion";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const fadeIn = (delay: number = 0) => ({
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.38, ease: EASE_OUT, delay },
});

function FormField({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label className="text-[12px] font-semibold text-foreground">
        {label} {required && <span className="text-destructive">*</span>}
      </Label>
      {children}
      {error && <p className="text-[11px] text-destructive">{error}</p>}
    </div>
  );
}

function InfoField({ label, value }: { label: string; value?: string }) {
  return (
    <div className="space-y-0.5">
      <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
        {label}
      </p>
      <p className="text-sm font-medium text-foreground">{value || "—"}</p>
    </div>
  );
}

function StudentInfoSkeleton() {
  return (
    <Card className="border border-border shadow-sm rounded-xl overflow-hidden">
      <div className="border-b border-border bg-muted/20 px-6 py-4">
        <div className="h-4 w-32 rounded bg-muted animate-pulse" />
      </div>
      <CardContent className="px-6 py-5">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="space-y-1.5">
              <div className="h-3 w-16 rounded bg-muted animate-pulse" />
              <div className="h-4 w-24 rounded bg-muted animate-pulse" />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-muted-foreground pl-0.5">
      {children}
    </p>
  );
}

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
      if (field === "fromLine") updated.fromStation = "";
      if (field === "toLine") updated.toStation = "";
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

  const selectTriggerClass = (field: string) =>
    `w-full h-9 rounded-lg border border-black/20 bg-white text-sm ${
      errors[field] ? "border-destructive" : ""
    }`;

  const disabledTriggerClass = (field: string) =>
    `w-full h-9 rounded-lg border border-black/[0.08] bg-black/[0.04] text-sm ${
      errors[field] ? "border-destructive" : ""
    }`;

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      <StudentHeader />

      <PageWrapper>
        <main className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">
          <motion.div {...fadeIn(0)}>
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <Train className="h-4 w-4 text-primary-foreground" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-foreground">
                Apply for Railway Concession
              </h1>
            </div>
            <p className="mt-1 pl-10 text-[13px] text-muted-foreground">
              Government Polytechnic Mumbai &mdash; Student Portal
            </p>
          </motion.div>

          {!student ? (
            <motion.div {...fadeIn(0.06)}>
              <StudentInfoSkeleton />
            </motion.div>
          ) : (
            <motion.div {...fadeIn(0.06)}>
              <Card className="border border-border shadow-sm rounded-xl overflow-hidden">
                <div className="border-b border-border bg-muted/20 px-6 py-4">
                  <p className="text-sm font-semibold text-foreground">
                    Applicant Details
                  </p>
                </div>
                <CardContent className="px-6 py-5">
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
                    <InfoField
                      label="Enrollment No"
                      value={student.enrollmentNo}
                    />
                    <InfoField label="Name" value={student.fullName} />
                    <InfoField label="Department" value={student.course} />
                    <InfoField
                      label="Year / Semester"
                      value={`${student.year} / ${student.sem}`}
                    />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          <motion.div {...fadeIn(0.11)}>
            <Card className="border border-border shadow-sm rounded-xl overflow-hidden">
              <CardHeader className="px-6 py-4 border-b border-border bg-muted/20">
                <CardTitle className="text-sm font-semibold text-foreground">
                  Concession Details
                </CardTitle>
              </CardHeader>

              <CardContent className="px-6 py-6">
                <form onSubmit={handleSubmit} className="space-y-7">
                  <div className="space-y-3">
                    <SectionHeading>Travel Preferences</SectionHeading>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        label="Class"
                        required
                        error={errors.travelClass}
                      >
                        <Select
                          value={formData.travelClass}
                          onValueChange={(v) => handleChange("travelClass", v)}
                        >
                          <SelectTrigger
                            id="travelClass"
                            className={selectTriggerClass("travelClass")}
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
                      </FormField>

                      <FormField label="Period" required error={errors.period}>
                        <Select
                          value={formData.period}
                          onValueChange={(v) => handleChange("period", v)}
                        >
                          <SelectTrigger
                            id="period"
                            className={selectTriggerClass("period")}
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
                      </FormField>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <SectionHeading>Departure Details</SectionHeading>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField
                        label="From Line"
                        required
                        error={errors.fromLine}
                      >
                        <Select
                          value={formData.fromLine}
                          onValueChange={(v) => handleChange("fromLine", v)}
                        >
                          <SelectTrigger
                            id="fromLine"
                            className={selectTriggerClass("fromLine")}
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
                      </FormField>

                      <FormField
                        label="From Station"
                        required
                        error={errors.fromStation}
                      >
                        <Select
                          value={formData.fromStation}
                          onValueChange={(v) => handleChange("fromStation", v)}
                          disabled={!formData.fromLine}
                        >
                          <SelectTrigger
                            id="fromStation"
                            className={
                              !formData.fromLine
                                ? disabledTriggerClass("fromStation")
                                : selectTriggerClass("fromStation")
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
                          <SelectContent className="bg-white max-h-60 overflow-y-scroll">
                            {fromStations.map((station) => (
                              <SelectItem key={station} value={station}>
                                {station}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-3">
                    <SectionHeading>Arrival Details</SectionHeading>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <FormField label="To Line" required error={errors.toLine}>
                        <Select
                          value={formData.toLine}
                          onValueChange={(v) => handleChange("toLine", v)}
                        >
                          <SelectTrigger
                            id="toLine"
                            className={selectTriggerClass("toLine")}
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
                      </FormField>

                      <FormField
                        label="To Station"
                        required
                        error={errors.toStation}
                      >
                        <Select
                          value={formData.toStation}
                          onValueChange={(v) => handleChange("toStation", v)}
                          disabled={!formData.toLine}
                        >
                          <SelectTrigger
                            id="toStation"
                            className={
                              !formData.toLine
                                ? disabledTriggerClass("toStation")
                                : selectTriggerClass("toStation")
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
                          <SelectContent className="bg-white max-h-60 overflow-y-scroll">
                            {toStations.map((station) => (
                              <SelectItem key={station} value={station}>
                                {station}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormField>
                    </div>
                  </div>

                  {formData.fromStation && formData.toStation && (
                    <motion.div
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, ease: EASE_OUT }}
                    >
                      <div className="rounded-xl border border-border bg-muted/30 px-5 py-4 space-y-2">
                        <p className="text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
                          Route Summary
                        </p>
                        <div className="flex flex-wrap items-center gap-2 text-sm font-medium text-foreground">
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span>{formData.fromStation}</span>
                            <span className="text-[11px] text-muted-foreground font-normal">
                              ({getLineName(formData.fromLine)})
                            </span>
                          </div>
                          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <div className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5 text-primary shrink-0" />
                            <span>{formData.toStation}</span>
                            <span className="text-[11px] text-muted-foreground font-normal">
                              ({getLineName(formData.toLine)})
                            </span>
                          </div>
                        </div>
                        {formData.travelClass && formData.period && (
                          <p className="text-[12px] text-muted-foreground">
                            {formData.travelClass} &nbsp;&bull;&nbsp;{" "}
                            {formData.period} Pass
                          </p>
                        )}
                      </div>
                    </motion.div>
                  )}

                  <div className="flex items-start gap-2.5 rounded-xl border border-warning/30 bg-warning/10 px-4 py-3.5">
                    <AlertTriangle className="h-4 w-4 text-warning shrink-0 mt-0.5" />
                    <p className="text-[12px] leading-relaxed text-foreground">
                      <span className="font-semibold">Important:</span>{" "}
                      Applications may be rejected if incorrect information is
                      provided. Please verify all details before submitting.
                    </p>
                  </div>

                  <div className="flex flex-col gap-3 pt-1 sm:flex-row">
                    <Button
                      type="submit"
                      disabled={isSubmitting}
                      className="flex-1 h-9 rounded-lg text-sm font-semibold disabled:opacity-50 transition-colors duration-150 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting…
                        </>
                      ) : (
                        "Submit Application"
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancel}
                      className="flex-1 h-9 rounded-lg text-sm font-semibold border-border hover:bg-muted hover:border-primary/40 transition-all duration-150"
                    >
                      Cancel
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div
            {...fadeIn(0.18)}
            className="flex items-center gap-3 pb-6"
          >
            <div className="h-px flex-1 bg-border" />
            <p className="whitespace-nowrap px-3 text-[11px] text-muted-foreground">
              Railway Concession Management System &mdash; Government
              Polytechnic Mumbai
            </p>
            <div className="h-px flex-1 bg-border" />
          </motion.div>
        </main>
      </PageWrapper>
    </div>
  );
};

export default NewConcessionApplication;
