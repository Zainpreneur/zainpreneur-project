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
  });
}

