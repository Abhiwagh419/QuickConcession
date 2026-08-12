import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Train,
  MessageCircle,
  Send,
  GraduationCap,
  Users,
  ShieldCheck,
  Bot,
  CheckCircle2,
} from "lucide-react";
import TicketMark from "@/components/TicketMark";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For Staff", href: "#roles" },
];

const ROLE_CARDS = [
  {
    icon: GraduationCap,
    title: "Student",
    description:
      "Apply for your concession pass, track its status, and get instant answers from QuickChat.",
    features: ["ONLINE APPLICATION", "STATUS TRACKING", "AI ASSISTANT"],
  },
  {
    icon: Users,
    title: "Staff",
    description:
      "Review applications, approve or reject with a reason, and get AI-assisted context on every case.",
    features: ["APPLICATION REVIEW", "REVIEW FLAGS", "STUDENT LOOKUP"],
  },
  {
    icon: ShieldCheck,
    title: "Admin",
    description:
      "Manage student and staff records, monitor system health, and export data anytime.",
    features: ["USER MANAGEMENT", "ANALYTICS", "EXCEL EXPORT"],
  },
];

const FOOTER_COLUMNS = [
  {
    title: "Portal",
    links: ["Apply for concession", "Track status", "FAQ"],
  },
  {
    title: "Roles",
    links: ["Student sign in", "Staff sign in", "Admin sign in"],
  },
  {
    title: "Support",
    links: ["Contact IT — 10 AM to 5 PM", "Help center"],
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#fafafa]/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#171717]">
              <Train className="h-3 w-3 text-white" strokeWidth={2.4} />
            </div>
            <span className="text-[14px] font-semibold tracking-tight">
              QuickConcession
            </span>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="text-[13px] font-medium text-black/50 transition-colors hover:text-black"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate("/login")}
              className="text-[13px] font-medium text-black/60 transition-colors hover:text-black"
            >
              Sign In
            </button>
            <button
              onClick={() => navigate("/login")}
              className="rounded-full bg-[#171717] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-85"
            >
              Apply Now
            </button>
          </div>
        </div>
      </header>

      <section className="relative overflow-hidden px-6 pt-20 pb-16 md:pt-28 md:pb-24">
        <div className="mx-auto grid max-w-6xl items-center gap-12 md:grid-cols-2">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
          >
            <p className="mb-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
              Government Polytechnic Mumbai
            </p>
            <h1 className="text-[44px] font-semibold leading-[1.05] tracking-[-0.03em] md:text-[56px]">
              Railway
              <br />
              concessions,
              <br />
              <span className="text-black/25">simplified.</span>
            </h1>
            <p className="mt-6 max-w-md text-[15px] leading-relaxed text-black/50">
              Apply for your railway concession pass, track it in real time,
              and get answers instantly — no paperwork, no queues.
            </p>
            <div className="mt-8 flex items-center gap-3">
              <button
                onClick={() => navigate("/login")}
                className="rounded-full bg-[#171717] px-5 py-2.5 text-[13.5px] font-medium text-white transition-opacity hover:opacity-85"
              >
                Get Started
              </button>
              <a
                href="#how-it-works"
                className="rounded-full border border-black/10 px-5 py-2.5 text-[13.5px] font-medium text-black/70 transition-colors hover:border-black/20"
              >
                Learn More
              </a>
            </div>
            <div className="mt-12 flex items-center gap-8">
              {[
                { val: "100%", label: "Digital" },
                { val: "∞", label: "Trackable" },
                { val: "24h", label: "Access" },
              ].map(({ val, label }) => (
                <div key={label}>
                  <p className="font-mono text-[16px] font-medium tracking-tight">
                    {val}
                  </p>
                  <p className="text-[11px] text-black/35">{label}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT, delay: 0.1 }}
            className="flex items-center justify-center"
          >
            <TicketMark />
          </motion.div>
        </div>
      </section>

      <section id="features" className="border-t border-black/[0.06] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div>
              <h2 className="text-[28px] font-semibold tracking-[-0.02em] leading-snug">
                Get instant answers, day or night
              </h2>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-black/50">
                QuickChat is grounded in your real application data — status,
                eligibility, and FAQs — with no guessing and no waiting for
                office hours.
              </p>
            </div>

            <div className="rounded-2xl border border-black/[0.08] bg-white p-4 shadow-sm">
              <div className="flex items-center justify-between border-b border-black/[0.06] pb-3">
                <div className="flex items-center gap-2">
                  <Bot className="h-4 w-4 text-black/60" />
                  <span className="text-[12.5px] font-medium">
                    QuickConcession Assistant
                  </span>
                </div>
                <MessageCircle className="h-4 w-4 text-black/25" />
              </div>
              <div className="space-y-2 py-4">
                <div className="ml-auto w-fit rounded-lg bg-[#171717] px-3 py-1.5 text-[12px] text-white">
                  How is my application doing?
                </div>
                <div className="w-fit rounded-lg bg-black/[0.04] px-3 py-1.5 text-[12px] text-black/70">
                  Your pass to Bandra is issued, valid until 23 Sept 2026.
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-black/[0.08] px-3 py-2">
                <span className="flex-1 text-[12px] text-black/30">
                  Type your question...
                </span>
                <Send className="h-3.5 w-3.5 text-black/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="border-t border-black/[0.06] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="order-2 md:order-1 rounded-2xl border border-black/[0.08] bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-black/35">
                  Railway Concession Status
                </span>
                <CheckCircle2 className="h-4 w-4 text-emerald-500" />
              </div>
              <div className="mt-3 rounded-xl border border-emerald-100 bg-emerald-50/60 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-[13.5px] font-semibold">
                    Active Concession Pass
                  </span>
                  <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                    ISSUED
                  </span>
                </div>
                <p className="mt-1 font-mono text-[12.5px] text-black/50">
                  Ghatkopar → Bandra
                </p>
                <p className="mt-1 text-[11px] text-black/40">
                  Valid until 23 September 2026
                </p>
              </div>
            </div>

            <div className="order-1 md:order-2">
              <h2 className="text-[28px] font-semibold tracking-[-0.02em] leading-snug">
                Apply in minutes, track in real time
              </h2>
              <p className="mt-3 max-w-sm text-[14px] leading-relaxed text-black/50">
                Submit your application online, follow it through review, and
                see your pass details the moment it's issued.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="roles" className="border-t border-black/[0.06] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[28px] font-semibold tracking-[-0.02em]">
            Built for every role
          </h2>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {ROLE_CARDS.map(({ icon: Icon, title, description, features }) => (
              <div
                key={title}
                className="rounded-2xl border border-black/[0.08] bg-white p-6"
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.04]">
                  <Icon className="h-4 w-4 text-black/70" strokeWidth={1.75} />
                </div>
                <h3 className="mt-4 text-[15px] font-semibold">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-black/50">
                  {description}
                </p>
                <div className="mt-4 space-y-1.5 border-t border-black/[0.06] pt-4">
                  {features.map((feature) => (
                    <p
                      key={feature}
                      className="text-[10.5px] font-medium tracking-wide text-black/35"
                    >
                      {feature}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-t border-black/[0.06] px-6 py-24 text-center">
        <h2 className="text-[30px] font-semibold tracking-[-0.02em]">
          Ready when you are.
        </h2>
        <p className="mx-auto mt-3 max-w-sm text-[14px] text-black/50">
          Sign in with your college-issued credentials to get started.
        </p>
        <button
          onClick={() => navigate("/login")}
          className="mt-7 rounded-full bg-[#171717] px-6 py-2.5 text-[13.5px] font-medium text-white transition-opacity hover:opacity-85"
        >
          Sign In
        </button>
      </section>

      <footer className="border-t border-black/[0.06] px-6 py-14">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-4">
            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-5 w-5 items-center justify-center rounded-md bg-[#171717]">
                  <Train className="h-2.5 w-2.5 text-white" strokeWidth={2.4} />
                </div>
                <span className="text-[13px] font-semibold">
                  QuickConcession
                </span>
              </div>
              <p className="mt-3 text-[12px] leading-relaxed text-black/40">
                Government Polytechnic Mumbai — Official Academic Portal
              </p>
            </div>

            {FOOTER_COLUMNS.map((column) => (
              <div key={column.title}>
                <p className="text-[11px] font-semibold uppercase tracking-wider text-black/35">
                  {column.title}
                </p>
                <ul className="mt-3 space-y-2">
                  {column.links.map((link) => (
                    <li key={link} className="text-[12.5px] text-black/50">
                      {link}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-12 border-t border-black/[0.06] pt-6 text-[11px] text-black/30">
            © {new Date().getFullYear()} Government Polytechnic Mumbai
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
