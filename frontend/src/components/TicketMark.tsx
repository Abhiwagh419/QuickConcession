interface TicketMarkProps {
  variant?: "dark" | "light";
}

const TicketMark = ({ variant = "light" }: TicketMarkProps) => {
  const ticketFill = variant === "dark" ? "#ffffff" : "#171717";
  const notchColor = variant === "dark" ? "#0a0a0a" : "#fafafa";
  const ambientColor = variant === "dark" ? "#ffffff" : "#000000";

  return (
    <div className="group relative flex items-center justify-center">
      <div
        className="pointer-events-none absolute h-[110px] w-[110px] animate-[spin_26s_linear_infinite] opacity-[0.10] blur-md"
        style={{
          background: `conic-gradient(from 0deg, ${ambientColor}, transparent 30%, transparent 70%, ${ambientColor})`,
        }}
      />
      <div
        className="pointer-events-none absolute h-[190px] w-[190px] animate-[spin_26s_linear_infinite] opacity-0 blur-xl transition-opacity duration-[900ms] ease-out group-hover:opacity-40"
        style={{
          background:
            "conic-gradient(from 0deg, #ff6ec4, #6ee7ff, #ffe66d, #ff6ec4)",
        }}
      />
      <svg
        viewBox="0 0 160 108"
        className="relative h-24 w-auto lg:h-28 xl:h-32"
        aria-hidden="true"
      >
        <rect x="0" y="0" width="160" height="108" rx="18" fill={ticketFill} />
        <circle cx="0" cy="54" r="17" fill={notchColor} />
        <line
          x1="58"
          y1="14"
          x2="58"
          y2="94"
          stroke={notchColor}
          strokeWidth="2"
          strokeDasharray="1 10"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
};

export default TicketMark;
