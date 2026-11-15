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
          toast: "group toast border-none rounded-xl shadow-lg",
          description: "text-sm",
          actionButton: "text-sm font-medium",
          cancelButton: "text-sm font-medium",
        },
      }}
    />
  );
}

export { SonnerToaster };
