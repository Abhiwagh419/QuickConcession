import { ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Train } from "lucide-react";
import TicketMark from "@/components/TicketMark";
import PageWrapper from "@/components/PageWrapper";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

interface AuthShellProps {
  eyebrow: string;
  headline: ReactNode;
  children: ReactNode;
}

const AuthShell = ({ eyebrow, headline, children }: AuthShellProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#0a0a0a] flex flex-col">
      <PageWrapper>
        <div className="flex flex-col lg:hidden min-h-screen relative overflow-hidden">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: EASE_OUT }}
            className="relative z-0 flex-shrink-0 px-6 pt-12 pb-16"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.04]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
                backgroundSize: "160px 160px",
              }}
            />

            <div className="relative z-10 flex items-center justify-between mb-10">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2.5"
              >
                <div className="h-7 w-7 rounded-lg bg-white flex items-center justify-center">
                  <Train
                    className="h-3.5 w-3.5 text-[#0a0a0a]"
                    strokeWidth={2.2}
                  />
                </div>
                <span className="text-[13.5px] font-semibold text-white tracking-tight">
                  QuickConcession
                </span>
              </button>
              <span className="text-[9.5px] font-medium tracking-[0.16em] uppercase text-white/25">
                GPM · Mumbai
              </span>
            </div>

            <div className="relative z-10">
              <p className="text-[10px] font-semibold tracking-[0.2em] uppercase text-white/30 mb-4">
                {eyebrow}
              </p>
              <h1 className="text-[32px] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
                {headline}
              </h1>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, ease: EASE_OUT, delay: 0.08 }}
            className="relative z-10 flex-1 bg-white rounded-t-[28px] -mt-6 px-6 pt-8 pb-10 flex flex-col"
          >
            <div className="mx-auto w-10 h-1 rounded-full bg-black/10 mb-7" />
            {children}
          </motion.div>
        </div>

        <div className="hidden lg:flex flex-1 min-h-screen">
          <motion.aside
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, ease: EASE_OUT }}
            className="relative lg:w-[44%] xl:w-[40%] flex flex-col justify-between bg-[#0a0a0a] px-12 xl:px-16 py-12 overflow-hidden"
          >
            <div
              className="pointer-events-none absolute inset-0 opacity-[0.035]"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                backgroundSize: "180px 180px",
              }}
            />
            <div className="absolute right-0 top-0 bottom-0 w-px bg-white/[0.06]" />

            <div className="relative z-10 flex items-center gap-3">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-3"
              >
                <div className="h-7 w-7 flex items-center justify-center rounded-md bg-white">
                  <Train
                    className="h-3.5 w-3.5 text-[#0a0a0a]"
                    strokeWidth={2.25}
                  />
                </div>
                <span className="text-[14px] font-semibold tracking-tight text-white">
                  QuickConcession
                </span>
              </button>
            </div>

            <div className="relative z-10 flex-1 flex items-center justify-center">
              <TicketMark variant="dark" />
            </div>

            <div className="relative z-10 space-y-10">
              <div className="space-y-5">
                <div className="flex items-center gap-2">
                  <div className="h-px w-6 bg-white/20" />
                  <span className="text-[10.5px] font-medium tracking-[0.18em] uppercase text-white/35">
                    {eyebrow}
                  </span>
                </div>
                <h2 className="text-[36px] xl:text-[42px] font-semibold leading-[1.1] tracking-[-0.03em] text-white">
                  {headline}
                </h2>
              </div>
            </div>

            <div className="relative z-10">
              <p className="text-[11px] text-white/20 tracking-wide">
                © {new Date().getFullYear()} · Official Academic Portal
              </p>
            </div>
          </motion.aside>

          <motion.main
            initial={{ opacity: 0, x: 12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.1 }}
            className="flex-1 flex flex-col bg-white"
          >
            <div className="flex-1 flex items-center justify-center px-12 xl:px-20 py-14">
              <div className="w-full max-w-[380px]">{children}</div>
            </div>
          </motion.main>
        </div>
      </PageWrapper>
    </div>
  );
};

export default AuthShell;
