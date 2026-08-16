import { useNavigate } from "react-router-dom";
import { Train, ArrowLeft } from "lucide-react";
import { FAQ_ITEMS } from "@/content/faq";

const FaqPage = () => {
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
          Frequently asked questions
        </h1>
        <p className="mt-3 text-[14.5px] leading-relaxed text-black/50">
          If your question isn't answered here, sign in and ask QuickChat —
          it can pull the specifics from your own account.
        </p>

        <div className="mt-10 divide-y divide-black/[0.06]">
          {FAQ_ITEMS.map(({ question, answer }) => (
            <div key={question} className="py-6">
              <p className="text-[15.5px] font-medium">{question}</p>
              <p className="mt-2 text-[14px] leading-relaxed text-black/50">
                {answer}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-12 rounded-2xl border border-black/[0.08] bg-white p-6 text-center">
          <p className="text-[14px] text-black/60">
            Still need help? The IT Department is available 10 AM to 5 PM.
          </p>
          <button
            onClick={() => navigate("/login")}
            className="mt-4 rounded-full bg-[#171717] px-5 py-2.5 text-[13.5px] font-medium text-white transition-opacity hover:opacity-85"
          >
            Sign In to Ask QuickChat
          </button>
        </div>
      </main>
    </div>
  );
};

export default FaqPage;
