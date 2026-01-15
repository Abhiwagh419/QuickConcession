export const railwayLines = [
  { id: "western", name: "Western Line" },
  { id: "central", name: "Central Line" },
  { id: "harbour", name: "Harbour Line" },
  { id: "transharbour", name: "Trans-Harbour Line" },
];

export const stationsByLine: Record<string, string[]> = {
  western: [
    "Churchgate",
    "Marine Lines",
    "Charni Road",
    "Grant Road",
    "Mumbai Central",
    "Mahalaxmi",
    "Lower Parel",
    "Elphinstone Road",
    "Dadar",
    "Matunga Road",
    "Mahim",
    "Bandra",
    "Khar Road",
    "Santacruz",
    "Vile Parle",
    "Andheri",
    "Jogeshwari",
    "Ram Mandir",
    "Goregaon",
    "Malad",
    "Kandivali",
    "Borivali",
    "Dahisar",
    "Mira Road",
    "Bhayandar",
    "Naigaon",
    "Vasai Road",
    "Nallasopara",
    "Virar",
  ],
  central: [
    "CSMT",
    "Masjid",
    "Sandhurst Road",
    "Byculla",
    "Chinchpokli",
    "Currey Road",
    "Parel",
    "Dadar",
    "Matunga",
    "Sion",
    "Kurla",
    "Vidyavihar",
    "Ghatkopar",
    "Vikhroli",
    "Kanjurmarg",
    "Bhandup",
    "Nahur",
    "Mulund",
    "Thane",
    "Kalwa",
    "Mumbra",
    "Diva",
    "Kopar",
    "Dombivli",
    "Thakurli",
    "Kalyan",
  ],
  harbour: [
    "CSMT",
    "Masjid",
    "Sandhurst Road",
    "Dockyard Road",
    "Reay Road",
    "Cotton Green",
    "Sewri",
    "Wadala Road",
    "GTB Nagar",
    "Chunabhatti",
    "Kurla",
    "Tilak Nagar",
    "Chembur",
    "Govandi",
    "Mankhurd",
    "Vashi",
    "Sanpada",
    "Juinagar",
    "Nerul",
    "Seawoods-Darave",
    "CBD Belapur",
    "Kharghar",
    "Mansarovar",
    "Khandeshwar",
    "Panvel",
  ],
  transharbour: [
    "Thane",
    "Airoli",
    "Rabale",
    "Ghansoli",
    "Kopar Khairane",
    "Turbhe",
    "Sanpada",
    "Vashi",
    "Juinagar",
    "Nerul",
    "Seawoods-Darave",
    "CBD Belapur",
    "Kharghar",
    "Mansarovar",
    "Khandeshwar",
    "Panvel",
  ],
};

export const departments = [
  "Computer Engineering",
  "Information Technology",
  "Electronics & Telecommunication",
  "Mechanical Engineering",
  "Civil Engineering",
  "Electrical Engineering",
];

export const years = ["FY", "SY", "TY"];

export const semestersByYear: Record<string, string[]> = {
  FY: ["SEM_I", "SEM_II"],
  SY: ["SEM_III", "SEM_IV"],
  TY: ["SEM_V", "SEM_VI"],
};


export const concessionClasses = ["First Class", "Second Class"];

export const concessionPeriods = ["Monthly", "Quarterly"];

export type ApplicationStatus = "Submitted" | "Approved" | "Rejected" | "Issued";

export interface ConcessionApplication {
  id: string;
  enrollmentNo: string;
  fromLine: string;
  toLine: string;
  fromStation: string;
  toStation: string;
  travelClass: string;
  period: string;
  applicationDate: string;
  status: ApplicationStatus;
  concessionNumber?: string;
  issueDate?: string;
  expiryDate?: string;
}

export const mockApplications: ConcessionApplication[] = [
  {
    id: "1",
    enrollmentNo: "2024001234",
    fromLine: "Western Line",
    toLine: "Western Line",
    fromStation: "Borivali",
    toStation: "Churchgate",
    travelClass: "Second Class",
    period: "Quarterly",
    applicationDate: "2025-10-15",
    status: "Issued",
    concessionNumber: "RC2025001234",
    issueDate: "2025-10-18",
    expiryDate: "2026-01-17",
  },
  {
    id: "2",
    enrollmentNo: "2024001234",
    fromLine: "Western Line",
    toLine: "Western Line",
    fromStation: "Borivali",
    toStation: "Churchgate",
    travelClass: "Second Class",
    period: "Quarterly",
    applicationDate: "2025-07-10",
    status: "Issued",
    concessionNumber: "RC2025001122",
    issueDate: "2025-07-12",
    expiryDate: "2025-10-11",
  },
  {
    id: "3",
    enrollmentNo: "2024001234",
    fromLine: "Central Line",
    toLine: "Western Line",
    fromStation: "Thane",
    toStation: "Dadar",
    travelClass: "First Class",
    period: "Monthly",
    applicationDate: "2025-04-05",
    status: "Rejected",
  },
];

export const mockStudentData = {
  enrollmentNo: "2024001234",
  name: "Rahul Sharma",
  department: "Computer Engineering",
  year: "Second Year",
  semester: "Semester 4",
  dateOfBirth: "2004-05-15",
  email: "rahul.sharma@gpmumbai.ac.in",
  phone: "9876543210",
  address: "A-101, Shanti Nagar, Borivali West, Mumbai - 400092",
  shift: "First Shift",
  resultStatus: "Pass",
  attendance: 85,
};
