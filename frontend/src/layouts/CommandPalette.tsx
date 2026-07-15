import React, { useEffect, useState } from "react";
import { useUIStore } from "@/store/uiStore";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Server, Box, HardDrive, Network, Settings, TerminalSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const commands = [
  { id: "c1", name: "EC2 Instances", path: "/compute/ec2", icon: Server, group: "Compute" },
  { id: "c2", name: "Containers", path: "/compute/containers", icon: Box, group: "Compute" },
  { id: "c3", name: "S3 Buckets", path: "/storage/s3", icon: HardDrive, group: "Storage" },
  { id: "c4", name: "VPC Networks", path: "/networking/vpc", icon: Network, group: "Networking" },
  { id: "c5", name: "Terminal", path: "/tools/terminal", icon: TerminalSquare, group: "Tools" },
  { id: "c6", name: "Settings", path: "/tools/settings", icon: Settings, group: "Tools" }
];

export function CommandPalette() {
  const { commandPaletteOpen, setCommandPaletteOpen } = useUIStore();
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(!commandPaletteOpen);
      }
      if (e.key === "Escape") {
        setCommandPaletteOpen(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [commandPaletteOpen, setCommandPaletteOpen]);

  const filtered = commands.filter((cmd) => cmd.name.toLowerCase().includes(search.toLowerCase()));

  const handleSelect = (path: string) => {
    setCommandPaletteOpen(false);
    navigate(path);
    setSearch("");
  };

  return (
    <AnimatePresence>
      {commandPaletteOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setCommandPaletteOpen(false)}
            className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            transition={{ duration: 0.15 }}
            className="fixed top-[20%] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl bg-surface border border-border rounded-xl shadow-2xl overflow-hidden flex flex-col"
          >
            <div className="flex items-center px-4 border-b border-border h-14">
              <Search className="text-text-tertiary mr-3 shrink-0" size={20} />
              <input
                autoFocus
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search resources, commands, or settings..."
                className="flex-1 bg-transparent text-text-primary placeholder-text-tertiary outline-none"
              />
              <kbd className="bg-surface-active px-2 py-1 rounded text-xs font-mono text-text-secondary border border-border">ESC</kbd>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2 scrollbar-thin">
              {filtered.length === 0 ? (
                <div className="py-8 text-center text-text-tertiary text-sm">
                  No results found for "{search}"
                </div>
              ) : (
                <div className="space-y-1">
                  {filtered.map((cmd) => (
                    <button
                      key={cmd.id}
                      onClick={() => handleSelect(cmd.path)}
                      className="w-full flex items-center gap-3 px-3 py-3 rounded-lg hover:bg-surface-active text-left transition-colors group"
                    >
                      <cmd.icon size={18} className="text-text-tertiary group-hover:text-primary" />
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary group-hover:text-primary">{cmd.name}</span>
                        <span className="text-[10px] text-text-tertiary">{cmd.group}</span>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
