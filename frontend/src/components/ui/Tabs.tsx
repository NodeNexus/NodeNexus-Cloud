import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export function Tabs({ defaultValue, className, children }: { defaultValue: string, className?: string, children: React.ReactNode }) {
  const [active, setActive] = useState(defaultValue);
  return (
    <div className={cn("w-full", className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { active, setActive });
        }
        return child;
      })}
    </div>
  );
}

export function TabsList({ className, children, active, setActive }: any) {
  return (
    <div className={cn("inline-flex h-10 items-center justify-center rounded-[var(--radius-md)] bg-surface p-1 text-text-secondary border border-border", className)}>
      {React.Children.map(children, child => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { active, setActive });
        }
        return child;
      })}
    </div>
  );
}

export function TabsTrigger({ value, className, children, active, setActive }: any) {
  const isActive = active === value;
  return (
    <button
      type="button"
      onClick={() => setActive(value)}
      className={cn(
        "inline-flex items-center justify-center whitespace-nowrap rounded-[var(--radius-sm)] px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 relative",
        isActive ? "text-text-primary" : "hover:text-text-primary/80",
        className
      )}
    >
      {isActive && (
        <motion.div
          layoutId="activeTab"
          className="absolute inset-0 rounded-[var(--radius-sm)] bg-surface-active"
          transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
        />
      )}
      <span className="relative z-10">{children}</span>
    </button>
  );
}

export function TabsContent({ value, className, children, active }: any) {
  if (active !== value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      transition={{ duration: 0.2 }}
      className={cn("mt-2 ring-offset-background focus-visible:outline-none", className)}
    >
      {children}
    </motion.div>
  );
}
