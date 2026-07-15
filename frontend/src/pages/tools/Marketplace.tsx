import React from "react";
import { Download, CheckCircle, Search } from "lucide-react";
import { Button } from "@/components/ui/Button";

const apps = [
  { name: "PostgreSQL", desc: "Advanced open source relational database.", icon: "🐘", installed: true },
  { name: "Redis", desc: "In-memory data structure store, used as a database, cache.", icon: "🔴", installed: true },
  { name: "MongoDB", desc: "Document-oriented NoSQL database program.", icon: "🍃", installed: false },
  { name: "RabbitMQ", desc: "Open source message broker.", icon: "🐇", installed: true },
  { name: "Grafana", desc: "The open observability platform.", icon: "📊", installed: false },
  { name: "Nextcloud", desc: "Safe home for all your data.", icon: "☁️", installed: false },
];

export function Marketplace() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Marketplace</h1>
          <p className="text-text-secondary">One-click deployments for your cloud.</p>
        </div>
        <div className="relative">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-tertiary" />
          <input 
            type="text" 
            placeholder="Search applications..." 
            className="w-64 bg-surface border border-border rounded-md pl-9 pr-4 py-2 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {apps.map((app) => (
          <div key={app.name} className="bg-surface border border-border rounded-xl p-5 hover:border-text-tertiary transition-colors flex flex-col group">
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-lg bg-surface-active flex items-center justify-center text-2xl border border-border">
                {app.icon}
              </div>
              {app.installed ? (
                <span className="flex items-center gap-1 text-xs font-medium text-success bg-success/10 px-2 py-1 rounded-full border border-success/20">
                  <CheckCircle size={12} /> Installed
                </span>
              ) : null}
            </div>
            
            <h3 className="text-lg font-bold text-text-primary group-hover:text-primary transition-colors">{app.name}</h3>
            <p className="text-sm text-text-secondary mt-2 flex-1">{app.desc}</p>
            
            <div className="mt-6 pt-4 border-t border-border flex justify-between items-center">
              <span className="text-xs text-text-tertiary font-mono">Official</span>
              {app.installed ? (
                <Button variant="danger" size="sm">Remove</Button>
              ) : (
                <Button size="sm"><Download size={14} className="mr-2" /> Install</Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
