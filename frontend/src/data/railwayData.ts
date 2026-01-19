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
    "Prabhadevi",
    "Dadar",
    "Matunga Road",
    "Mahim",
    "Bandra",
    "Khar Road",
    "Santacruz",
    "Ville Parle",
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
    "Vaitarna",
    "Saphale",
    "Kelve Road",
    "Palghar",
    "Umroli",
    "Boisar",
    "Vasind",
    "Dahanu Road",
  ],
  central: [
    "Chhhatrapati Shivaji Maharaj Terminus (CSMT)",
    "Masjid Bunder",
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
    "Vitthalvadi",
    "Ulhasnagar",
    "Ambernath",
    "Badlapur",
    "Vangani",
    "Shelu",
    "Neral",
    "Bhivpuri Road",
    "Karjat",
    "Palasdari",
    "Kelavli",
    "Dolavli",
    "Lowjee",
    "Khopoli",
    "Shahad",
    "Ambivli",
    "Titwala",
    "Khadavali",
    "Vashind",
    "Asangaon",
    "Atgaon",
    "Thansit",
    "Khardi",
    "Umbermali",
    "Kasara",
  ],
  harbour: [
    "Chhatrapati Shivaji Maharaj Terminus (CSMT)",
    "Masjid Bunder",
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
    "Belapur",
    "Kharghar",
    "Mansarovar",
    "Khandeshwar",
    "Panvel",
    "King's Circle",
    "Mahim",
    "Bandra",
    "Khar Road",
    "Santacruz",
    "Ville Parle",
    "Andheri",
    "Jogeshwari",
    "Ram Mandir",
    "Goregaon",
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
    "Belapur",
    "Kharghar",
    "Mansarovar",
    "Khandeshwar",
    "Panvel",
  ],
};

export const departments = [
  "Civil Engineering",
  "Computer Engineering",
  "Electrical Engineering",
  "Electronics Engineering",
  "Information Technology",
  "Instrumentation Engineering",
  "Mechanical Engineering",
  "Leather Technology",
  "Leather Goods and Footwear Technology",
  "Rubber Technology",
  "Artificial Intelligence and Machine Learning",
];

export const years = ["FY", "SY", "TY"];

export const semestersByYear: Record<string, string[]> = {
  FY: ["SEM_I", "SEM_II"],
  SY: ["SEM_III", "SEM_IV"],
  TY: ["SEM_V", "SEM_VI"],
};

export const concessionClasses = ["First Class", "Second Class"];

export const concessionPeriods = ["Monthly", "Quarterly"];

export type ApplicationStatus =
  | "Submitted"
  | "Approved"
  | "Rejected"
  | "Issued"
  | "Expired";

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
