export interface FaqEntry {
  id: string;
  question: string;
  answer: string;
  keywords: string[];
}

export const faqKnowledgeBase: FaqEntry[] = [
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
      "Applications are rejected if details are incorrect, incomplete, or eligibility criteria are not met. Check the remarks in your application history for the specific reason.",
    keywords: ["rejected", "rejection", "denied", "declined", "why"],
  },
  {
    id: "expiry",
    question: "When will my concession expire?",
    answer:
      "The concession expiry date depends on the selected duration and is shown once the pass is issued.",
    keywords: ["expire", "expiry", "validity", "valid", "duration"],
  },
  {
    id: "reapply",
    question: "How to reapply for concession?",
    answer:
      "You can reapply once your previous concession expires by submitting a new application from the dashboard.",
    keywords: ["reapply", "renew", "renewal", "again", "resubmit"],
  },
];

export interface EligibilityCriteria {
  institution: string;
  allowedYears: "any" | number[];
  allowedCategories: string[];
  isPlaceholder: boolean;
}

export const eligibilityCriteria: EligibilityCriteria = {
  institution: "Government Polytechnic, Mumbai",
  allowedYears: "any",
  allowedCategories: ["General"],
  isPlaceholder: true,
};
