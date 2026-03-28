"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

type ToastType = "success" | "error" | "loading" | "info";

interface ToastItem {
  id: number;
  type: ToastType;
  message: string;
}

interface ToastContextType {
  showToast: (opts: { type: ToastType; message: string }) => void;
  dismissAll: () => void;
}

const ToastContext = createContext<ToastContextType>({
  showToast: () => {},
  dismissAll: () => {},
});

export function useToast() {
  return useContext(ToastContext);
}

let toastId = 0;

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const showToast = useCallback(({ type, message }: { type: ToastType; message: string }) => {
    const id = ++toastId;
    setToasts((prev) => [...prev, { id, type, message }]);
    if (type !== "loading") {
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 4000);
    }
  }, []);

  const dismissToast = useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const dismissAll = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, dismissAll }}>
      {children}
      <div className="fixed top-20 right-4 z-[100] flex flex-col gap-2 max-w-sm">
        {toasts.map((toast) => (
          <div
            key={toast.id}
            onClick={() => dismissToast(toast.id)}
            className={`animate-slide-in-right cursor-pointer px-4 py-3 rounded-lg border backdrop-blur-md shadow-lg text-sm font-medium flex items-center gap-2 ${
              toast.type === "success"
                ? "bg-[var(--accent-green)]/10 border-[var(--accent-green)] text-[var(--accent-green)]"
                : toast.type === "error"
                ? "bg-[var(--accent-red)]/10 border-[var(--accent-red)] text-[var(--accent-red)]"
                : toast.type === "loading"
                ? "bg-[var(--accent-cyan)]/10 border-[var(--accent-cyan)] text-[var(--accent-cyan)]"
                : "bg-[var(--primary)]/10 border-[var(--primary-light)] text-[var(--accent-cyan)]"
            }`}
          >
            {toast.type === "success" && <span>✅</span>}
            {toast.type === "error" && <span>❌</span>}
            {toast.type === "loading" && (
              <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
            )}
            {toast.type === "info" && <span>ℹ️</span>}
            <span>{toast.message}</span>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
