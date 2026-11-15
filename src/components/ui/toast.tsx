"use client";

import { toast as sonnerToast } from "sonner";

export function toast({ title, description, action, id }: {
  title?: string;
  description?: string;
  action?: any;
  id?: string;
}) {
  return sonnerToast(title ?? "", {
    description,
    action,
    id,
    className: "rounded-xl border border-white/10 bg-[#111827] text-[#F8FAFC] shadow-lg shadow-black/20",
    descriptionClassName: "text-slate-300",
  });
}
