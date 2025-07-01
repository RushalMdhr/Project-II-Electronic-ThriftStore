import { forwardRef } from "react";
import { cn } from "../../Utils/cn";

const Badge = forwardRef(
  ({ className, variant = "default", ...props }, ref) => {
    const variants = {
      default: "bg-green-500 text-white hover:bg-green-600 border-transparent", // active
      secondary:
        "bg-yellow-400 text-black hover:bg-yellow-500 border-transparent", // inactive
      destructive: "bg-red-600 text-white hover:bg-red-700 border-transparent", // banned
      outline:
        "bg-gray-100 text-gray-800 border border-gray-300 hover:bg-gray-200", // fallback
    };

    return (
      <div
        ref={ref}
        className={cn(
          "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500",
          variants[variant],
          className
        )}
        {...props}
      />
    );
  }
);

Badge.displayName = "Badge";

export { Badge };
