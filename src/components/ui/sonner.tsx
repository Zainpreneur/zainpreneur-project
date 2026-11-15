"use client";

import { Toaster as SonnerToaster } from "sonner";

export function Toaster() {
  return (
    <SonnerToaster
      position="bottom-right"
      richColors
      closeButton
      className="z-50"
      toastOptions={{
        classNames: {
          toast: "group toast border border-white/10 rounded-xl shadow-lg shadow-black/20",
          description: "text-sm text-slate-300",
          actionButton: "text-xs font-medium text-indigo-400",
          cancelButton: "text-xs font-medium text-slate-400",
        },
      }}
    />
  );
}

export { SonnerToaster };
