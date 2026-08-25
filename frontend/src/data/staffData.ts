export type StaffApplicationStatus =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "EXPIRED";

export interface StaffApplication {
  id: string;
  studentName: string;
  enrollmentNo: string;
  travelClass: string;
  department: string;
  year: string;
  semester: string;
  fromLine: string;
  toLine: string;
  fromStation: string;
  toStation: string;
  period: string;
  applicationDate: string;
  status: StaffApplicationStatus;
  approvedAt?: string;
  rejectedDate?: string;
  rejectionReason?: string;
  concessionNumber?: string;
  issueDate?: string;
  issuedBy?: string;
  studentEmail?: string;
  studentPhone?: string;
  studentAddress?: string;
  dateOfBirth?: string;
  resultStatus?: string;
  attendance?: number;
}
