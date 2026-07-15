import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useUIStore } from "@/store/uiStore";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, Server, Box, HardDrive, Database, Network,
  Activity, ShoppingBag, TerminalSquare, FolderOpen,
  Bot, Settings, Users, ArrowLeftToLine, ArrowRightToLine
} from "lucide-react";

const navItems = [
  { group: "Overview", items: [{ name: "Dashboard", icon: LayoutDashboard, path: "/" }] },
  { group: "Compute", items: [
    { name: "EC2 Instances", icon: Server, path: "/compute/ec2" },
    { name: "Containers", icon: Box, path: "/compute/containers" },
  ]},
  { group: "Storage", items: [
    { name: "S3 Buckets", icon: HardDrive, path: "/storage/s3" },
    { name: "EBS Volumes", icon: HardDrive, path: "/storage/ebs" },
    { name: "Databases", icon: Database, path: "/storage/rds" },
  ]},
  { group: "Network & Security", items: [
    { name: "VPC Networks", icon: Network, path: "/networking/vpc" },
    { name: "IAM & Users", icon: Users, path: "/security/iam" },
  ]},
  { group: "Tools", items: [
    { name: "Monitoring", icon: Activity, path: "/tools/monitoring" },
    { name: "Marketplace", icon: ShoppingBag, path: "/tools/marketplace" },
    { name: "Terminal", icon: TerminalSquare, path: "/tools/terminal" },
    { name: "File Explorer", icon: FolderOpen, path: "/tools/files" },
    { name: "AI Assistant", icon: Bot, path: "/tools/ai" },
    { name: "Settings", icon: Settings, path: "/tools/settings" },
  ]}
];

export function Sidebar() {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const location = useLocation();

  return (
    <motion.aside
      initial={false}
      animate={{ width: sidebarOpen ? 260 : 64 }}
      className="h-full border-r border-border bg-surface flex flex-col z-20 flex-shrink-0"
    >
      <div className="h-14 flex items-center justify-between px-4 border-b border-border">
        {sidebarOpen && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex items-center gap-2 overflow-hidden">
            <div className="h-6 w-6 rounded bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
              <span className="text-white text-xs font-bold">V2</span>
            </div>
            <span className="font-bold text-text-primary whitespace-nowrap">VNAV Cloud</span>
          </motion.div>
        )}
        {!sidebarOpen && (
          <div className="mx-auto h-6 w-6 rounded bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center shrink-0">
            <span className="text-white text-xs font-bold">V2</span>
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto overflow-x-hidden py-4 scrollbar-thin">
        {navItems.map((group, i) => (
          <div key={group.group} className={cn("mb-6", !sidebarOpen && "flex justify-center")}>
            {sidebarOpen && (
              <h4 className="px-4 text-xs font-semibold text-text-tertiary uppercase tracking-wider mb-2">
                {group.group}
              </h4>
            )}
            <ul className="space-y-0.5 px-2">
              {group.items.map((item) => {
                const isActive = location.pathname === item.path || (item.path !== "/" && location.pathname.startsWith(item.path));
                return (
                  <li key={item.name}>
                    <Link
                      to={item.path}
                      title={!sidebarOpen ? item.name : undefined}
                      className={cn(
                        "flex items-center gap-3 px-3 py-2 rounded-md transition-colors relative group",
                        isActive ? "text-primary bg-primary/10" : "text-text-secondary hover:text-text-primary hover:bg-surface-hover"
                      )}
                    >
                      {isActive && sidebarOpen && (
                        <motion.div layoutId="sidebar-active" className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-primary rounded-r-full" />
                      )}
                      <item.icon size={18} className="shrink-0" />
                      {sidebarOpen && <span className="text-sm font-medium whitespace-nowrap">{item.name}</span>}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="p-3 border-t border-border flex justify-end">
        <button
          onClick={toggleSidebar}
          className="p-2 rounded-md text-text-tertiary hover:text-text-primary hover:bg-surface-hover transition-colors"
        >
          {sidebarOpen ? <ArrowLeftToLine size={18} /> : <ArrowRightToLine size={18} />}
        </button>
      </div>
    </motion.aside>
  );
}
