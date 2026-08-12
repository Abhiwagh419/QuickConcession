import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import PageWrapper from "@/components/PageWrapper";
import { Button } from "@/components/ui/button";
import { FileX, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

type CubicBezier = [number, number, number, number];
const EASE_OUT: CubicBezier = [0.16, 1, 0.3, 1];

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <PageWrapper>
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: EASE_OUT }}
          className="w-full max-w-md"
        >
          <div className="rounded-xl border border-border bg-card shadow-sm overflow-hidden">
            <div className="border-b border-border bg-muted/20 px-6 py-4 flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-destructive/10">
                <FileX className="h-3.5 w-3.5 text-destructive" />
              </div>
              <span className="text-sm font-semibold text-foreground">
                Page Not Found
              </span>
            </div>

            <div className="px-8 py-10 text-center space-y-4">
              <p className="text-6xl font-bold tabular-nums text-foreground tracking-tight">
                404
              </p>

              <div className="space-y-1.5">
                <p className="text-[15px] font-semibold text-foreground">
                  This page does not exist
                </p>
                <p className="text-[13px] text-muted-foreground leading-relaxed">
                  The route{" "}
                  <code className="rounded bg-muted px-1.5 py-0.5 text-[12px] font-mono text-foreground">
                    {location.pathname}
                  </code>{" "}
                  could not be found. It may have been moved, deleted, or you
                  may not have permission to access it.
                </p>
              </div>

              <div className="pt-2">
                <Button
                  onClick={() => navigate("/login")}
                  variant="outline"
                  size="sm"
                  className="h-9 rounded-lg border-border text-sm font-semibold hover:bg-muted hover:border-primary/40 transition-all duration-150 flex items-center gap-2 mx-auto"
                >
                  <ArrowLeft className="h-3.5 w-3.5" />
                  Return to Home
                </Button>
              </div>
            </div>

            <div className="border-t border-border bg-muted/20 px-6 py-3 text-center">
              <p className="text-[11px] text-muted-foreground">
                QuickConcession &mdash; Government Polytechnic Mumbai
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </PageWrapper>
  );
};

export default NotFound;
