import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Train, ArrowLeft, LucideIcon } from "lucide-react";
import Footer from "@/components/Footer";
import { LegalSection, LEGAL_LAST_UPDATED } from "@/content/legal";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

type LegalPageLayoutProps = {
  eyebrow: string;
  title: string;
  description: string;
  icon: LucideIcon;
  sections: LegalSection[];
};

const scrollToSection = (id: string) => (e: React.MouseEvent) => {
  e.preventDefault();
  const el = document.getElementById(id);
  if (!el) return;
  const headerOffset = 88;
  const top = el.getBoundingClientRect().top + window.scrollY - headerOffset;
  window.scrollTo({ top, behavior: "smooth" });
};

const LegalPageLayout = ({
  eyebrow,
  title,
  description,
  icon: Icon,
  sections,
}: LegalPageLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#171717] font-sans">
      <header className="sticky top-0 z-30 border-b border-black/[0.06] bg-[#fafafa]/80 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
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

      <section className="relative overflow-hidden px-6 pt-20 pb-14 md:pt-28 md:pb-16">
        <div className="mx-auto max-w-3xl">
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, ease: EASE_OUT }}
            onClick={() => navigate("/")}
            className="mb-8 flex items-center gap-1.5 text-[13px] font-medium text-black/50 transition-colors hover:text-black"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to home
          </motion.button>

          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, ease: EASE_OUT, delay: 0.05 }}
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-black/[0.04]">
              <Icon className="h-5 w-5 text-black/70" strokeWidth={1.75} />
            </div>
            <p className="mt-5 text-[11px] font-semibold uppercase tracking-[0.18em] text-black/35">
              {eyebrow}
            </p>
            <h1 className="mt-2 text-[36px] font-semibold leading-[1.1] tracking-[-0.03em] md:text-[44px]">
              {title}
            </h1>
            <p className="mt-5 max-w-xl text-[15px] leading-relaxed text-black/50">
              {description}
            </p>
            <p className="mt-4 text-[12.5px] text-black/35">
              Last updated: {LEGAL_LAST_UPDATED}
            </p>
          </motion.div>
        </div>
      </section>

      <section className="border-t border-black/[0.06] px-6 py-16">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[240px_1fr]">
          <nav className="hidden md:block">
            <div className="sticky top-24 space-y-1">
              <p className="mb-3 text-[11px] font-semibold uppercase tracking-wider text-black/35">
                On this page
              </p>
              {sections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={scrollToSection(section.id)}
                  className="block rounded-md px-2.5 py-1.5 text-[13px] text-black/50 transition-colors hover:bg-black/[0.03] hover:text-black"
                >
                  {section.title}
                </a>
              ))}
            </div>
          </nav>

          <div className="max-w-2xl divide-y divide-black/[0.06]">
            {sections.map((section, index) => (
              <motion.div
                key={section.id}
                id={section.id}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  duration: 0.45,
                  ease: EASE_OUT,
                  delay: Math.min(index * 0.03, 0.15),
                }}
                className="scroll-mt-24 py-8 first:pt-0"
              >
                <h2 className="text-[19px] font-semibold tracking-[-0.01em]">
                  {section.title}
                </h2>
                <div className="mt-3 space-y-3">
                  {section.blocks.map((block, blockIndex) =>
                    block.type === "p" ? (
                      <p
                        key={blockIndex}
                        className="text-[14px] leading-relaxed text-black/60"
                      >
                        {block.text}
                      </p>
                    ) : (
                      <ul key={blockIndex} className="space-y-2.5">
                        {block.items.map((item, itemIndex) => (
                          <li
                            key={itemIndex}
                            className="flex items-start gap-3"
                          >
                            <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-black/25" />
                            <span className="text-[14px] leading-relaxed text-black/60">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    ),
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default LegalPageLayout;
