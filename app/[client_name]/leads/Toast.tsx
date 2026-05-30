"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

type ToastKind = "success" | "error" | "info";

interface ToastItem {
  id: number;
  kind: ToastKind;
  message: string;
}

interface ToastContextValue {
  push: (kind: ToastKind, message: string) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);

  const push = useCallback((kind: ToastKind, message: string) => {
    const id = Date.now() + Math.random();
    setItems((prev) => [...prev, { id, kind, message }]);
    window.setTimeout(() => {
      setItems((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  return (
    <ToastContext.Provider value={{ push }}>
      {children}
      <div className="fixed bottom-6 right-6 z-[60] flex flex-col gap-2 pointer-events-none">
        {items.map((t) => (
          <ToastBubble key={t.id} kind={t.kind} message={t.message} />
        ))}
      </div>
    </ToastContext.Provider>
  );
}

function ToastBubble({ kind, message }: { kind: ToastKind; message: string }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const id = window.requestAnimationFrame(() => setVisible(true));
    return () => window.cancelAnimationFrame(id);
  }, []);

  const palette =
    kind === "success"
      ? "border-[#00B98E]/40 bg-[#00B98E]/15 text-[#00B98E]"
      : kind === "error"
        ? "border-red-500/40 bg-red-500/15 text-red-300"
        : "border-white/20 bg-white/10 text-white/90";

  return (
    <div
      className={`pointer-events-auto min-w-[240px] max-w-sm rounded-2xl border px-4 py-3 text-sm shadow-2xl shadow-black/40 backdrop-blur-md transition-all duration-200 ${palette} ${
        visible ? "translate-y-0 opacity-100" : "translate-y-2 opacity-0"
      }`}
    >
      {message}
    </div>
  );
}

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    return {
      push: (_, message) => {
        if (typeof window !== "undefined") console.log("[toast]", message);
      },
    };
  }
  return ctx;
}
