import { GraduationCap } from "lucide-react";
const LoginHeader = () => {
  return (
    <header className="header-gradient py-4 px-6 shadow-lg">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-foreground/10 flex items-center justify-center border-2 border-primary-foreground/30">
            <GraduationCap className="w-6 h-6 text-header-foreground" />
          </div>
          <div className="flex flex-col text-header-foreground">
            <span className="font-heading font-bold text-lg leading-tight">
              Government Polytechnic Mumbai
            </span>
            <span className="text-sm text-header-foreground/80 leading-tight">
              An Autonomous Institute of Government of Maharashtra
            </span>
          </div>
        </div>
        <div className="hidden md:block text-right text-header-foreground">
          <span className="text-sm font-medium">QuickConcession Portal</span>
        </div>
      </div>
    </header>
  );
};
export default LoginHeader;
