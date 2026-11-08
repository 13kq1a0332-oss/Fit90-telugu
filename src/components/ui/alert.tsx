import * as React from "react";
import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info, AlertTriangle } from "lucide-react";

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "destructive" | "warning" | "success";
}

const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  ({ className, variant = "default", children, ...props }, ref) => {
    const variants = {
      default: "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200",
      destructive: "border-red-200 bg-red-50/90 text-red-900 dark:border-red-900 dark:bg-red-950/60 dark:text-red-200",
      warning: "border-amber-200 bg-amber-50/90 text-amber-900 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-200",
      success: "border-emerald-200 bg-emerald-50/90 text-emerald-900 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200",
    };

    const icons = {
      default: <Info className="h-5 w-5 text-slate-600 shrink-0 mt-0.5" />,
      destructive: <AlertCircle className="h-5 w-5 text-red-600 shrink-0 mt-0.5" />,
      warning: <AlertTriangle className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />,
      success: <CheckCircle2 className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />,
    };

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          "relative flex items-start gap-3 rounded-xl border p-4 text-sm leading-relaxed",
          variants[variant],
          className
        )}
        {...props}
      >
        {icons[variant]}
        <div className="flex-1">{children}</div>
      </div>
    );
  }
);
Alert.displayName = "Alert";

export { Alert };

