import { Card } from "./Card"
import type { LucideIcon } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  description?: string;
  trend?: "up" | "down" | "neutral";
  trendValue?: string;
  color?: "blue" | "green" | "purple" | "orange";
}

export const StatCard = ({
  title,
  value,
  icon: Icon,
  description,
  trend,
  trendValue,
  color = "blue",
}: StatCardProps) => {
  const colorMap = {
    blue: "text-blue-400 bg-blue-400/10",
    green: "text-emerald-400 bg-emerald-400/10",
    purple: "text-purple-400 bg-purple-400/10",
    orange: "text-orange-400 bg-orange-400/10",
  };

  return (
    <Card className="flex flex-col gap-4 relative overflow-hidden group">
      <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="flex items-center justify-between relative z-10">
        <span className="text-sm font-medium text-zinc-400">{title}</span>
        <div className={`p-2 rounded-lg ${colorMap[color]}`}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-3xl font-bold tracking-tight text-zinc-100 flex items-center h-10 overflow-hidden">
          <AnimatePresence mode="popLayout">
            <motion.div
              key={value}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 20, opacity: 0 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            >
              {value}
            </motion.div>
          </AnimatePresence>
        </div>
        {(description || trendValue) && (
          <div className="flex items-center gap-2 mt-1 text-sm h-5 overflow-hidden">
            {trendValue && (
              <span
                className={
                  trend === "up" ? "text-emerald-400" : trend === "down" ? "text-rose-400" : "text-zinc-400"
                }
              >
                {trendValue}
              </span>
            )}
            {description && (
              <AnimatePresence mode="popLayout">
                <motion.span
                  key={description}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-zinc-500"
                >
                  {description}
                </motion.span>
              </AnimatePresence>
            )}
          </div>
        )}
      </div>
    </Card>
  )
}
