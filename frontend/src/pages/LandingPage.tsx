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
import { FAQ_ITEMS } from "@/content/faq";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "For Students", href: "#students" },
  { label: "For Staff", href: "#staff" },
  { label: "For Admin", href: "#admin" },
  { label: "FAQ", href: "#faq" },
];

const STUDENT_FEATURES = [
  "Apply for your concession pass online in a few steps",
  "Track your application status in real time, no visits needed",
  "Secure OTP-verified login — no one gets into your account but you",
  "Manage your profile and reset your password anytime, without waiting on staff",
  "Your full application history, kept automatically — nothing to lose track of",
  "Ask QuickChat about your status, eligibility, or the process — day or night",
];

const STAFF_FEATURES = [
  "A dedicated review queue, split cleanly by pending, approved, and rejected",
  "Approve or reject with a reason — every decision is accountable and clear",
  "Look up any student's full application history by enrollment number in seconds",
  "Message students directly through live chat when you need more information",
  "Export your concession records to Excel whenever you need them",
  "QuickChat gives you application details and review flags the moment you ask",
  "Secure OTP-verified login on every session",
];

const ADMIN_FEATURES = [
  "Add, edit, deactivate, or restore student and staff records in a click",
  "Bulk-import an entire batch from a CSV — with a preview step, so mistakes get caught before they become records",
  "A live dashboard tracking every student, staff member, and application system-wide",
  "See any student's full application history and their approval rate at a glance",
  "Reset any staff member's password directly — no email loop, no waiting",
  "Step in and approve or reject an application yourself, whenever it's needed",
  "Export the complete student, staff, or application dataset to Excel",
];

const FOOTER_COLUMNS = [
  {
    title: "Portal",
    links: [
      { label: "Apply for concession", to: "/login" },
      { label: "Track status", to: "/login" },
      { label: "FAQ", to: "/faq" },
    ],
  },
  {
    title: "Roles",
    links: [
      { label: "Student sign in", to: "/login" },
      { label: "Staff sign in", to: "/login" },
      { label: "Admin sign in", to: "/login" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "Help & support", to: "/help" },
      { label: "Contact IT — 10 AM to 5 PM", to: "/help" },
    ],
  },
];

const LandingPage = () => {
  const navigate = useNavigate();

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    const el = document.getElementById(id);
    if (!el) return;
    const headerOffset = 72;
    const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
    window.scrollTo({ top, behavior: "smooth" });
  };

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

          <nav className="hidden items-center gap-6 lg:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={scrollToSection(link.href.replace("#", ""))}
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

      <section className="relative overflow-hidden px-6 pt-24 pb-20 md:pt-32 md:pb-28">
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-[1fr_auto_1fr]">
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
                onClick={scrollToSection("how-it-works")}
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
            className="order-first flex items-center justify-center py-6 lg:order-none lg:py-0"
          >
            <TicketMark />
          </motion.div>

          <div className="hidden flex-col items-end justify-center text-right lg:flex">
            <p className="text-[10px] font-semibold uppercase leading-[1.9] tracking-[0.14em] text-black/30">
              For students &amp; staff
              <br />
              Government Polytechnic Mumbai
              <br />
              Digital concession system
            </p>
          </div>
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

            <div className="relative flex h-[280px] items-center justify-center">
              <div
                className="absolute h-[220px] w-[300px] rounded-2xl border border-black/[0.06] bg-white"
                style={{
                  maskImage:
                    "linear-gradient(115deg, black 20%, transparent 65%)",
                  WebkitMaskImage:
                    "linear-gradient(115deg, black 20%, transparent 65%)",
                }}
              />
              <div className="relative w-72 rounded-2xl border border-black/[0.08] bg-white p-4 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]">
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
        </div>
      </section>

      <section id="tracking" className="border-t border-black/[0.06] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-center gap-10 md:grid-cols-2">
            <div className="order-2 md:order-1 relative flex justify-center">
              <div
                className="w-full max-w-sm rounded-2xl border border-black/[0.08] bg-white shadow-[0_20px_60px_-20px_rgba(0,0,0,0.25)]"
                style={{
                  maskImage: "linear-gradient(to bottom, black 70%, transparent 100%)",
                  WebkitMaskImage:
                    "linear-gradient(to bottom, black 70%, transparent 100%)",
                }}
              >
                <div className="flex items-center gap-1.5 border-b border-black/[0.06] px-4 py-2.5">
                  <span className="h-2 w-2 rounded-full bg-black/10" />
                  <span className="h-2 w-2 rounded-full bg-black/10" />
                  <span className="h-2 w-2 rounded-full bg-black/10" />
                </div>
                <div className="p-5">
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

      <section id="how-it-works" className="border-t border-black/[0.06] px-6 py-20">
        <div className="mx-auto max-w-6xl">
          <h2 className="text-[28px] font-semibold tracking-[-0.02em]">
            How it works
          </h2>
          <p className="mt-2 max-w-md text-[14px] text-black/50">
            Four steps from sign in to a valid concession pass.
          </p>
          <div className="mt-10 grid gap-8 md:grid-cols-4">
            {[
              {
                step: "01",
                title: "Sign in",
                description:
                  "Log in with your enrollment number and password, verified by OTP.",
              },
              {
                step: "02",
                title: "Apply",
                description:
                  "Fill in your route, travel class, and concession duration.",
              },
              {
                step: "03",
                title: "Staff review",
                description:
                  "College staff verify your details and approve or reject with a reason.",
              },
              {
                step: "04",
                title: "Get your pass",
                description:
                  "Once approved, your digital pass is issued and trackable anytime.",
              },
            ].map(({ step, title, description }) => (
              <div key={step}>
                <p className="font-mono text-[13px] text-black/25">{step}</p>
                <h3 className="mt-3 text-[15px] font-semibold">{title}</h3>
                <p className="mt-1.5 text-[13px] leading-relaxed text-black/50">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="students" className="border-t border-black/[0.06] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04]">
                <GraduationCap className="h-5 w-5 text-black/70" strokeWidth={1.75} />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/35">
                For Students
              </p>
              <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] leading-tight">
                Skip the queue. Get your pass online.
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-black/50">
                No standing in line at the railway counter or the college
                office. Apply from your phone, and always know exactly where
                your application stands.
              </p>
            </div>

            <ul className="space-y-4 pt-2 md:pt-16">
              {STUDENT_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-black/30" />
                  <span className="text-[14px] leading-relaxed text-black/70">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="staff" className="border-t border-black/[0.06] bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04]">
                <Users className="h-5 w-5 text-black/70" strokeWidth={1.75} />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/35">
                For Staff
              </p>
              <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] leading-tight">
                Review faster, with the full picture in front of you.
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-black/50">
                Every application arrives with the context you need to make a
                confident call — no digging through paperwork or chasing
                students for details.
              </p>
            </div>

            <ul className="space-y-4 pt-2 md:pt-16">
              {STAFF_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-black/30" />
                  <span className="text-[14px] leading-relaxed text-black/70">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="admin" className="border-t border-black/[0.06] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid items-start gap-12 md:grid-cols-2">
            <div>
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04]">
                <ShieldCheck className="h-5 w-5 text-black/70" strokeWidth={1.75} />
              </div>
              <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.14em] text-black/35">
                For Admin
              </p>
              <h2 className="mt-2 text-[30px] font-semibold tracking-[-0.02em] leading-tight">
                Run the whole system from one dashboard.
              </h2>
              <p className="mt-4 max-w-md text-[14.5px] leading-relaxed text-black/50">
                Manage every student and staff record, watch the numbers move
                in real time, and export anything you need — no spreadsheets
                to maintain by hand.
              </p>
            </div>

            <ul className="space-y-4 pt-2 md:pt-16">
              {ADMIN_FEATURES.map((feature) => (
                <li key={feature} className="flex items-start gap-3">
                  <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-black/30" />
                  <span className="text-[14px] leading-relaxed text-black/70">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section id="faq" className="border-t border-black/[0.06] px-6 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-10 md:grid-cols-[280px_1fr]">
            <div>
              <h2 className="text-[28px] font-semibold tracking-[-0.02em] leading-snug">
                Frequently asked
              </h2>
              <p className="mt-3 text-[14px] leading-relaxed text-black/50">
                A few common questions. Sign in for anything more specific —
                QuickChat can answer from your real data.
              </p>
            </div>

            <div className="divide-y divide-black/[0.06]">
              {FAQ_ITEMS.map(({ question, answer }) => (
                <div key={question} className="py-5">
                  <p className="text-[14.5px] font-medium">{question}</p>
                  <p className="mt-1.5 text-[13.5px] leading-relaxed text-black/50">
                    {answer}
                  </p>
                </div>
              ))}
            </div>
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
                    <li key={link.label}>
                      <button
                        onClick={() => navigate(link.to)}
                        className="text-left text-[12.5px] text-black/50 transition-colors hover:text-black"
                      >
                        {link.label}
                      </button>
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
