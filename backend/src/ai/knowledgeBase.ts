export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

export const faqKnowledgeBase: FaqEntry[] = [
  {
    id: "eligibility",
    question: "Who is eligible for a concession pass?",
    answer:
      "Any actively enrolled student of Government Polytechnic, Mumbai is eligible to apply — there is no separate category (General/OBC/SC/ST/etc.) requirement. If you can log in with your enrollment number, you're eligible to apply.",
    keywords: [
      "eligible",
      "eligibility",
      "qualify",
      "qualification",
      "category",
      "obc",
      "sc",
      "st",
      "general",
      "ews",
      "reserved",
      "reservation",
      "who can apply",
    ],
  },
  {
    id: "how-to-apply",
    question: "How do I apply for a concession pass?",
    answer:
      "Sign in with your enrollment number, password, and OTP, then go to New Application. Pick your travel class (First Class or Second Class), your period (Monthly or Quarterly), and your from/to railway line and stations, then submit. Staff will review it from there.",
    keywords: [
      "apply",
      "application",
      "how to apply",
      "new application",
      "submit",
      "form",
      "steps",
    ],
  },
  {
    id: "travel-class-period",
    question: "What travel class and duration options are available?",
    answer:
      "Travel class options are First Class and Second Class. Duration (period) options are Monthly and Quarterly. You choose these when filling out your application.",
    keywords: [
      "travel class",
      "first class",
      "second class",
      "class",
      "period",
      "monthly",
      "quarterly",
      "duration",
      "options",
    ],
  },
  {
    id: "approval-time",
    question: "How long does approval take?",
    answer:
      "Approval usually takes 1–3 working days after submission, depending on verification workload.",
    keywords: ["approval", "time", "long", "days", "wait", "pending"],
  },
  {
    id: "rejection-reasons",
    question: "Why was my application rejected?",
    answer:
      "Applications are rejected if details are incorrect or incomplete — for example a mismatched route or station. Check the specific rejection reason on your dashboard (ask QuickChat 'what's my application status' to see it directly), then submit a fresh application with corrected details.",
    keywords: ["rejected", "rejection", "denied", "declined", "why"],
  },
  {
    id: "check-status",
    question: "How do I check my application status?",
    answer:
      "Ask QuickChat 'what's my application status' while signed in, or check your dashboard directly — both pull your real, current status, not a guess.",
    keywords: ["status", "track", "check", "where is my application", "pending"],
  },
  {
    id: "expiry",
    question: "When will my concession expire?",
    answer:
      "The concession expiry date depends on the selected duration (Monthly or Quarterly) and is shown on your dashboard once the pass is issued. The system automatically marks it expired once that date passes.",
    keywords: ["expire", "expiry", "validity", "valid", "duration"],
  },
  {
    id: "reapply",
    question: "How to reapply for concession?",
    answer:
      "You can reapply once your previous concession expires by submitting a new application from the dashboard — the process is identical to your first application.",
    keywords: ["reapply", "renew", "renewal", "again", "resubmit"],
  },
  {
    id: "otp-login",
    question: "Why do I need an OTP to log in?",
    answer:
      "Every login — student, staff, or admin — is verified with a one-time password sent to your registered email, on top of your regular password, to keep your account secure.",
    keywords: ["otp", "one-time password", "verification code", "login", "sign in"],
  },
  {
    id: "quickchat-capabilities",
    question: "What can QuickChat actually help with?",
    answer:
      "QuickChat can check your eligibility, look up your own application status and rejection reason, and answer common questions about the process — all using your real account data, not guesses. For anything it can't do, it'll say so plainly instead of making something up.",
    keywords: ["quickchat", "chatbot", "assistant", "what can you do", "help"],
  },
  {
    id: "contact-support",
    question: "Who can I contact if something's not working?",
    answer:
      "The IT Department is available 10 AM to 5 PM for portal issues, account problems, or anything QuickChat can't resolve.",
    keywords: ["contact", "support", "it department", "help", "not working", "issue"],
  },
];

export interface EligibilityCriteria {
  institution: string;
  allowedYears: "any" | number[];
  isPlaceholder: boolean;
}

// NOTE: There is intentionally no "category" (General/OBC/SC/ST/etc.) field
// here. Railway student concessions are based on being a bona fide enrolled
// student, not social category — and this app's own database schema and
// application form never collected a category field in the first place.
// The old version of this file had `allowedCategories: ["General"]`, which
// silently marked every non-"General" student ineligible even though the
// rest of the app never asked them for a category. If your institution's
// official policy does have a real additional eligibility rule (e.g. a
// minimum attendance requirement, distance-learning exclusion, or age cap),
// add that as its own explicit field here rather than reusing "category".
export const eligibilityCriteria: EligibilityCriteria = {
  institution: "Government Polytechnic, Mumbai",
  allowedYears: "any",
  isPlaceholder: false,
};
