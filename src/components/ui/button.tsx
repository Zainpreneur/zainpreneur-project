"use client";

import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
  size?: "default" | "sm" | "lg" | "icon";
  asChild?: boolean;
}

function buttonVariants(props: { variant?: ButtonProps["variant"]; size?: ButtonProps["size"]; className?: string }): string {
  const { variant = "default", size = "default", className } = props;
  const base = "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shrink-0";
  const variants: Record<string, Record<string, string>> = {
    variant: {
      default: "bg-indigo-600 text-white shadow-sm shadow-indigo-500/20 hover:bg-indigo-700 hover:shadow-indigo-500/30 hover:translate-y-[-1px] active:bg-indigo-800 active:translate-y-0 dark:bg-blue-400 dark:text-slate-900 dark:hover:bg-blue-300 dark:shadow-blue-500/25 dark:active:bg-blue-200",
      destructive: "bg-red-500 text-white shadow-sm shadow-red-500/20 hover:bg-red-600 hover:shadow-red-500/30 hover:translate-y-[-1px] active:bg-red-700 active:translate-y-0",
      outline: "border border-slate-200 bg-white text-slate-700 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:border-white/10 dark:bg-gray-900 dark:text-slate-100 dark:hover:bg-gray-800 dark:hover:text-white",
      secondary: "bg-slate-100 text-slate-700 hover:bg-slate-200 hover:translate-y-[-1px] active:bg-slate-200 dark:bg-gray-800 dark:text-slate-200 dark:hover:bg-gray-700",
      ghost: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:bg-slate-200 dark:text-slate-400 dark:hover:bg-gray-800 dark:hover:text-white dark:active:bg-gray-700",
      link: "text-indigo-600 underline-offset-4 hover:underline dark:text-blue-400",
    },
    size: {
      default: "h-10 px-4 py-2",
      sm: "h-9 rounded-md px-3",
      lg: "h-11 rounded-md px-8",
      icon: "h-10 w-10",
    },
  };
  let classes = base;
  for (const [key, val] of Object.entries(variants)) {
    const active = (props as any)[key];
    if (active && val[active]) classes += ` ${val[active]}`;
  }
  return cn(classes, className);
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : "button";
  return (
    <Comp className={buttonVariants({ variant, size, className })} ref={ref} {...props} />
  );
});

Button.displayName = "Button";

export { Button };
