import { useNavigate } from "react-router-dom";
import { Train, ArrowLeft, Clock, MessageCircle, HelpCircle } from "lucide-react";

const HelpPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#fafafa]/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-3xl items-center justify-between px-6">
          <button
            onClick={() => navigate("/")}
            className="flex items-center gap-2.5"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-[#171717]">
              <Train className="h-3 w-3 text-white" strokeWidth={2.4} />
            </div>
            <span className="text-[14px] font-semibold tracking-tight">
              QuickConcession
            </span>
          </button>
          <button
            onClick={() => navigate("/login")}
            className="rounded-full bg-[#171717] px-4 py-2 text-[13px] font-medium text-white transition-opacity hover:opacity-85"
          >
            Sign In
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-3xl px-6 py-16">
        <button
          onClick={() => navigate("/")}
          className="mb-8 flex items-center gap-1.5 text-[13px] font-medium text-black/50 transition-colors hover:text-black"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          Back to home
        </button>

        <h1 className="text-[34px] font-semibold tracking-[-0.02em]">
          Help &amp; support
        </h1>
        <p className="mt-3 max-w-xl text-[14.5px] leading-relaxed text-black/50">
          A few ways to get unstuck, depending on what you need.
        </p>

        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.04]">
              <Clock className="h-4 w-4 text-black/70" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-[14.5px] font-semibold">
              IT Department
            </h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-black/50">
              Available 10 AM to 5 PM for portal issues, account problems, or
              anything QuickChat can't resolve.
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.04]">
              <MessageCircle className="h-4 w-4 text-black/70" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-[14.5px] font-semibold">QuickChat</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-black/50">
              Sign in and ask directly — it answers from your real
              application data, any time of day.
            </p>
          </div>

          <div className="rounded-2xl border border-black/[0.08] bg-white p-6">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-black/[0.04]">
              <HelpCircle className="h-4 w-4 text-black/70" strokeWidth={1.75} />
            </div>
            <h3 className="mt-4 text-[14.5px] font-semibold">FAQ</h3>
            <p className="mt-1.5 text-[13px] leading-relaxed text-black/50">
              Common questions about applying, tracking, and account
              security, answered upfront.
            </p>
            <button
              onClick={() => navigate("/faq")}
              className="mt-3 text-[13px] font-medium text-black/70 underline underline-offset-2 hover:text-black"
            >
              View FAQ
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default HelpPage;
