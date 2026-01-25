import { apiFetch } from "@/lib/api";

export const getStudentSummary = (enrollmentNo: string) =>
  apiFetch(`/staff/students/${enrollmentNo}/summary`);
