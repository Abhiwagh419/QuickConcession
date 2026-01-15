import { GraduationCap } from "lucide-react";

interface CollegeLogoProps {
  size?: "sm" | "md" | "lg";
  showText?: boolean;
  variant?: "light" | "dark";
}

const CollegeLogo = ({ size = "md", showText = true, variant = "dark" }: CollegeLogoProps) => {
  const sizeClasses = {
    sm: "w-10 h-10",
    md: "w-14 h-14",
    lg: "w-20 h-20",
  };

  const textColors = {
    light: "text-header-foreground",
    dark: "text-primary",
  };

  const iconColors = {
    light: "text-header-foreground",
    dark: "text-primary",
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} rounded-full bg-secondary flex items-center justify-center border-2 border-primary/20`}>
        <GraduationCap className={`${size === "sm" ? "w-5 h-5" : size === "md" ? "w-7 h-7" : "w-10 h-10"} ${iconColors[variant]}`} />
      </div>
      {showText && (
        <div className={`flex flex-col ${textColors[variant]}`}>
          <span className={`font-heading font-bold ${size === "lg" ? "text-xl" : "text-lg"} leading-tight`}>
            Government Polytechnic
          </span>
          <span className={`font-medium ${size === "lg" ? "text-lg" : "text-base"} leading-tight`}>
            Mumbai
          </span>
        </div>
      )}
    </div>
  );
};

export default CollegeLogo;
