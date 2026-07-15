import React from "react";
import { useUIStore } from "@/store/uiStore";
import { motion, AnimatePresence } from "framer-motion";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const icons = {
  success: <CheckCircle className="text-success" size={20} />,
  error: <AlertCircle className="text-danger" size={20} />,
  info: <Info className="text-info" size={20} />,
  warning: <AlertTriangle className="text-warning" size={20} />
};

export function ToastProvider() {
  const { toasts, removeToast } = useUIStore();

  return (
    <div className="fixed bottom-0 right-0 z-[100] p-6 w-full max-w-sm flex flex-col gap-3 pointer-events-none">
      <AnimatePresence>
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            className={cn(
              "pointer-events-auto bg-surface-active border border-border shadow-2xl rounded-[var(--radius-md)] p-4 flex gap-4 items-start",
              toast.type === "success" && "border-success/30 bg-success/5",
              toast.type === "error" && "border-danger/30 bg-danger/5",
            )}
          >
            <div className="shrink-0 mt-0.5">{icons[toast.type]}</div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-text-primary">{toast.title}</h4>
              {toast.description && (
                <p className="text-sm text-text-secondary mt-1">{toast.description}</p>
              )}
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="shrink-0 text-text-tertiary hover:text-text-primary transition-colors"
            >
              <X size={16} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
