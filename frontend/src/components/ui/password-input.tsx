import * as React from "react";
import { Eye, EyeOff } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const REVEAL_DURATION_MS = 5000;

export interface PasswordInputProps extends Omit<
  React.ComponentProps<"input">,
  "type"
> {
  startAdornment?: React.ReactNode;
}

const PasswordInput = React.forwardRef<HTMLInputElement, PasswordInputProps>(
  ({ className, startAdornment, ...props }, ref) => {
    const [visible, setVisible] = React.useState(false);
    const timerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

    const clearTimer = () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };

    const toggleVisibility = () => {
      setVisible((prev) => {
        const next = !prev;

        clearTimer();

        if (next) {
          timerRef.current = setTimeout(() => {
            setVisible(false);
            timerRef.current = null;
          }, REVEAL_DURATION_MS);
        }

        return next;
      });
    };

    React.useEffect(() => {
      return () => clearTimer();
    }, []);

    return (
      <div className="relative">
        {startAdornment && (
          <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
            {startAdornment}
          </div>
        )}
        <Input
          {...props}
          ref={ref}
          type={visible ? "text" : "password"}
          className={cn(startAdornment && "pl-10", "pr-10", className)}
        />
        <button
          type="button"
          tabIndex={-1}
          onClick={toggleVisibility}
          aria-label={visible ? "Hide password" : "Show password"}
          aria-pressed={visible}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
        >
          {visible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    );
  },
);
PasswordInput.displayName = "PasswordInput";

export { PasswordInput };
