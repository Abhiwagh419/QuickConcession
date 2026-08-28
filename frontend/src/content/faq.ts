export interface FaqItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FaqItem[] = [
  {
    question: "Who is eligible to apply for a concession pass?",
    answer:
      "Any actively enrolled student of Government Polytechnic, Mumbai is eligible — there's no separate category (General/OBC/SC/ST/etc.) requirement. If your college has issued you login credentials, you're eligible to apply.",
  },
  {
    question: "How do I get my login details?",
    answer:
      "Student accounts are created by your college admin, who will share your enrollment number and initial password with you. If you haven't received these, contact the IT Department.",
  },
  {
    question: "How do I apply for a concession pass?",
    answer:
      "Sign in with your enrollment number and password, verified by a one-time OTP, then go to New Application and submit your travel line/stations, travel class, and duration from your dashboard.",
  },
  {
    question: "What travel class and duration options are there?",
    answer:
      "Travel class: First Class or Second Class. Duration: Monthly or Quarterly. You'll pick both when filling out your application.",
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
