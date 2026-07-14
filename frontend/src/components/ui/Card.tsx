import * as React from "react"
import { cn } from "@/lib/utils"
import { motion, type HTMLMotionProps } from "framer-motion"

export interface CardProps extends HTMLMotionProps<"div"> {
  gradient?: boolean;
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, gradient = false, children, ...props }, ref) => (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-white/10 bg-black/40 backdrop-blur-xl shadow-2xl p-6",
        gradient && "before:absolute before:inset-0 before:-z-10 before:bg-gradient-to-br before:from-primary/20 before:to-transparent before:opacity-50",
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  )
)
Card.displayName = "Card"
