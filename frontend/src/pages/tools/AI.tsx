import React from "react";
import { Bot, Send, Sparkles, Code, TerminalSquare } from "lucide-react";
import { Button } from "@/components/ui/Button";

export function AI() {
  return (
    <div className="h-[calc(100vh-140px)] flex flex-col">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-bold text-text-primary flex items-center gap-2">
            <Bot className="text-primary" /> AI Assistant
          </h1>
          <p className="text-text-secondary">Your intelligent cloud copilot.</p>
        </div>
      </div>

      <div className="flex-1 bg-surface border border-border rounded-xl flex overflow-hidden shadow-sm">
        {/* Chat History */}
        <div className="flex-1 flex flex-col">
          <div className="flex-1 p-6 overflow-y-auto space-y-6">
            
            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-surface-active flex items-center justify-center shrink-0">
                <span className="text-sm font-medium">U</span>
              </div>
              <div className="flex-1 pt-1">
                <p className="text-text-primary">Can you analyze the memory usage of the backend container over the last hour?</p>
              </div>
            </div>

            <div className="flex gap-4">
              <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <Sparkles size={16} className="text-primary" />
              </div>
              <div className="flex-1 pt-1 space-y-4">
                <p className="text-text-primary">I'll check the memory metrics for the `vnav-web-backend` container using Prometheus data.</p>
                
                <div className="bg-surface-active border border-border rounded-lg p-3 inline-block">
                  <div className="flex items-center gap-2 text-xs text-text-secondary mb-2 uppercase tracking-wider font-semibold">
                    <TerminalSquare size={12} /> Executing Tool
                  </div>
                  <div className="font-mono text-sm text-info">query_prometheus(metric="container_memory_usage_bytes", container="vnav-web-backend")</div>
                </div>

                <p className="text-text-primary">
                  The backend container is currently using <strong>412 MB</strong> of RAM. Over the last hour, it peaked at <strong>480 MB</strong> during a heavy API load but has since stabilized. This is well within your 1GB limit.
                </p>
              </div>
            </div>
            
          </div>
          
          <div className="p-4 border-t border-border bg-surface flex gap-2">
            <input 
              type="text" 
              placeholder="Ask the AI Assistant..." 
              className="flex-1 bg-background border border-border rounded-lg px-4 py-2 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary/50"
            />
            <Button size="icon"><Send size={18} /></Button>
          </div>
        </div>

        {/* Sidebar Context */}
        <div className="w-64 border-l border-border bg-surface-active/30 p-4 hidden lg:block">
          <h3 className="text-sm font-semibold text-text-primary uppercase tracking-wider mb-4">Context</h3>
          
          <div className="space-y-3">
            <div className="bg-surface border border-border rounded-md p-3 text-sm flex items-center gap-2">
              <Code size={16} className="text-primary" />
              <span className="truncate">frontend/package.json</span>
            </div>
            <div className="bg-surface border border-border rounded-md p-3 text-sm flex items-center gap-2">
              <TerminalSquare size={16} className="text-warning" />
              <span className="truncate">Recent Error Log</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
