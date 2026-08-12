interface TicketMarkProps {
  variant?: "dark" | "light";
}

const TicketMark = ({ variant = "light" }: TicketMarkProps) => {
  const ticketFill = variant === "dark" ? "#ffffff" : "#171717";
  const notchColor = variant === "dark" ? "#0a0a0a" : "#fafafa";

  return (
    <div className="group relative flex items-center justify-center">
      <div
        className="pointer-events-none absolute h-[420px] w-[420px] opacity-0 blur-3xl transition-opacity duration-700 ease-out group-hover:opacity-60"
        style={{
          background:
            "radial-gradient(circle at 30% 30%, #ff6ec4, transparent 55%), radial-gradient(circle at 72% 28%, #6ee7ff, transparent 55%), radial-gradient(circle at 50% 75%, #ffe66d, transparent 55%)",
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
