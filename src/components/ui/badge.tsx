"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "secondary" | "destructive" | "outline";
}

const badgeVariants = {
  default: "bg-indigo-600 text-white",
  secondary: "bg-gray-800 text-slate-200",
  destructive: "bg-red-500 text-white",
  outline: "border border-white/10 bg-transparent text-slate-400",
};

const Badge = React.forwardRef<HTMLDivElement, BadgeProps>(({ className, variant = "default", ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold leading-none",
      badgeVariants[variant],
      className,
    )}
    {...props}
  />
));

Badge.displayName = "Badge";

export { Badge };
