export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "How do I apply for a concession pass?",
    answer:
      "Sign in with your enrollment number and password, verified by a one-time OTP, then submit your route, travel class, and concession duration from your dashboard.",
  },
  {
    question: "How will I know if my application is approved or rejected?",
    answer:
      "Your dashboard updates the moment staff make a decision. If it's rejected, you'll see the exact reason staff gave — not just a status change.",
  },
  {
    question: "Is my login secure?",
    answer:
      "Every login — student, staff, or admin — is verified with a one-time password sent at sign-in, on top of your regular password.",
  },
  {
    question: "What happens after my pass is issued?",
    answer:
      "Your concession number and validity period appear on your dashboard, and the system automatically marks it expired once the validity period ends.",
  },
  {
    question: "Can I get answers without waiting for office hours?",
    answer:
      "Yes — QuickChat is available once you're signed in, and answers using your real application data instead of guessing.",
  },
  {
    question: "Who can I contact if something's not working?",
    answer:
      "The IT Department is available during office hours, 10 AM to 5 PM. If you're signed in, QuickChat can also help right away.",
  },
];
