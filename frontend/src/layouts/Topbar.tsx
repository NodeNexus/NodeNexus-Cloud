import React from "react";
import { useUIStore } from "@/store/uiStore";
import { Search, Bell, HelpCircle, User } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function Topbar() {
  const { setCommandPaletteOpen } = useUIStore();

  return (
    <header className="h-14 border-b border-border bg-surface flex items-center justify-between px-4 sticky top-0 z-10 flex-shrink-0">
      <div className="flex items-center gap-4 flex-1">
        <button
          onClick={() => setCommandPaletteOpen(true)}
          className="flex items-center gap-2 px-3 py-1.5 bg-background border border-border rounded-md text-sm text-text-tertiary hover:text-text-secondary hover:border-text-tertiary transition-colors w-64 shadow-sm"
        >
          <Search size={16} />
          <span>Search resources...</span>
          <div className="ml-auto flex items-center gap-1">
            <kbd className="bg-surface-active px-1.5 py-0.5 rounded text-[10px] font-mono font-medium">Ctrl</kbd>
            <kbd className="bg-surface-active px-1.5 py-0.5 rounded text-[10px] font-mono font-medium">K</kbd>
          </div>
        </button>
      </div>

      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 border-r border-border pr-3">
          <Badge variant="success" className="bg-success/10 text-success text-[10px] py-0">us-east-pi</Badge>
          <Badge variant="outline" className="text-[10px] py-0">vnav-homelab</Badge>
        </div>
        
        <button className="text-text-tertiary hover:text-text-primary transition-colors p-1 relative">
          <Bell size={18} />
          <span className="absolute top-0 right-0 w-2 h-2 rounded-full bg-danger border-2 border-surface"></span>
        </button>
        
        <button className="text-text-tertiary hover:text-text-primary transition-colors p-1">
          <HelpCircle size={18} />
        </button>
        
        <button className="h-8 w-8 rounded-full bg-surface-active border border-border flex items-center justify-center text-text-secondary hover:text-primary hover:border-primary transition-colors ml-2 shadow-sm">
          <User size={16} />
        </button>
      </div>
    </header>
  );
}
