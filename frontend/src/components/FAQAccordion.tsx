import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

type FAQ = {
  question: string;
  answer: string;
};

const faqs: FAQ[] = [
  {
    question: "Am I eligible to apply?",
    answer:
      "If you're logged in here as a student, you're eligible — there's no separate category (General/OBC/SC/ST/etc.) requirement to worry about.",
  },
  {
    question: "How long does approval take?",
    answer:
      "Approval usually takes 1–3 working days after submission, depending on verification workload.",
  },
  {
    question: "Why was my application rejected?",
    answer:
      "Applications are rejected if details are incorrect or incomplete — for example a mismatched route or station. Check the specific rejection reason on your dashboard, then submit a fresh application with corrected details.",
  },
  {
    question: "What class and duration can I choose?",
    answer:
      "Travel class: First Class or Second Class. Duration: Monthly or Quarterly.",
  },
  {
    question: "When will my concession expire?",
    answer:
      "The concession expiry date depends on the selected duration and is shown once the pass is issued. It's marked expired automatically once that date passes.",
  },
  {
    question: "How to reapply for concession?",
    answer:
      "You can reapply once your previous concession expires by submitting a new application from the dashboard.",
  },
];

export default function FAQAccordion() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="space-y-3">
      {faqs.map((faq, index) => {
        const isOpen = openIndex === index;

        return (
          <div
            key={index}
            className="border rounded-lg bg-muted/40 overflow-hidden"
          >
            <button
              className="w-full flex justify-between items-center px-4 py-3 text-left hover:bg-muted transition"
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <span className="font-medium text-sm">{faq.question}</span>
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  isOpen ? "rotate-180" : ""
                }`}
              />
            </button>

            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: "easeInOut" }}
                >
                  <div className="px-4 pb-4 text-sm text-muted-foreground">
                    {faq.answer}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
