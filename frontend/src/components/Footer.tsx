import { useNavigate } from "react-router-dom";
import { Train } from "lucide-react";

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
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", to: "/privacy" },
      { label: "Terms of Service", to: "/terms" },
    ],
  },
];

const Footer = () => {
  const navigate = useNavigate();

  return (
    <footer className="border-t border-black/[0.06] px-6 py-14">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 md:grid-cols-5">
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

        <div className="mt-12 flex flex-col gap-3 border-t border-black/[0.06] pt-6 text-[11px] text-black/30 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} Government Polytechnic Mumbai</span>
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/privacy")}
              className="transition-colors hover:text-black/60"
            >
              Privacy Policy
            </button>
            <button
              onClick={() => navigate("/terms")}
              className="transition-colors hover:text-black/60"
            >
              Terms of Service
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
