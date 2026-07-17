import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Play, Square, RefreshCw, Plus, X, Server, HardDrive } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface Instance {
  id: string;
  name: string;
  status: string;
  image: string;
  created: string;
}

export function EC2() {
  const [instances, setInstances] = useState<Instance[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Modal State
  const [isLaunchOpen, setIsLaunchOpen] = useState(false);
  const [launchConfig, setLaunchConfig] = useState({
    name: "",
    image: "ubuntu:latest",
    instance_type: "t2.micro"
  });

  const loadInstances = async () => {
    setRefreshing(true);
    try {
      const data = await fetchApi("/ec2/instances");
      setInstances(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadInstances();
  }, []);

  const handleLaunch = async () => {
    setLoading(true);
    try {
      await fetchApi("/ec2/instances", {
        method: "POST",
        body: JSON.stringify(launchConfig)
      });
      setIsLaunchOpen(false); // Close modal on success
      setLaunchConfig({ name: "", image: "ubuntu:latest", instance_type: "t2.micro" }); // Reset
      loadInstances();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async (id: string) => {
    try {
      await fetchApi(`/ec2/instances/${id}`, { method: "DELETE" });
      loadInstances();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6 relative">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">EC2 Instances</h1>
          <p className="text-text-secondary">Manage your Docker-backed virtual instances.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadInstances} disabled={refreshing}>
            <RefreshCw size={14} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => setIsLaunchOpen(true)}>
            <Plus size={14} className="mr-2" /> Launch Instance
          </Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled><Play size={14} className="mr-2" /> Start</Button>
          <Button variant="secondary" size="sm" disabled><Square size={14} className="mr-2" /> Stop</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><input type="checkbox" className="rounded border-border bg-surface-active" /></TableHead>
              <TableHead>Instance ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instances.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-text-tertiary py-8">
                  No instances running.
                </TableCell>
              </TableRow>
            ) : instances.map((i) => (
              <TableRow key={i.id}>
                <TableCell><input type="checkbox" className="rounded border-border bg-surface-active" /></TableCell>
                <TableCell className="font-mono text-primary">{i.id}</TableCell>
                <TableCell className="font-medium">{i.name}</TableCell>
                <TableCell className="font-mono text-sm">{i.image}</TableCell>
                <TableCell>
                  <Badge variant={i.status === "running" ? "success" : "default"}>
                    {i.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-sm">{new Date(i.created).toLocaleString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleTerminate(i.id)}>Terminate</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Launch Instance Modal Overlay */}
      {isLaunchOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-surface border border-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-border flex justify-between items-center bg-surface-active/50">
              <h2 className="text-lg font-semibold text-text-primary flex items-center gap-2">
                <Server size={18} className="text-primary" /> Launch New Instance
              </h2>
              <button 
                onClick={() => setIsLaunchOpen(false)}
                className="text-text-secondary hover:text-text-primary transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6">
              
              {/* Name Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-text-secondary">Name (Optional)</label>
                <input 
                  type="text" 
                  value={launchConfig.name}
                  onChange={(e) => setLaunchConfig({...launchConfig, name: e.target.value})}
                  placeholder="e.g. web-server-1"
                  className="w-full bg-[#121214] border border-border rounded-md px-3 py-2 text-sm text-text-primary focus:outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* OS / Image Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-secondary">Amazon Machine Image (AMI)</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "ubuntu:latest", name: "Ubuntu Latest", icon: "🐧" },
                    { id: "nginx:alpine", name: "Nginx Alpine", icon: "🌐" },
                    { id: "python:3.11-slim", name: "Python 3.11", icon: "🐍" },
                    { id: "node:18-alpine", name: "Node.js 18", icon: "🟢" },
                    { id: "redis:alpine", name: "Redis Cache", icon: "⚡" },
                    { id: "postgres:15-alpine", name: "PostgreSQL", icon: "🐘" },
                  ].map((img) => (
                    <div 
                      key={img.id}
                      onClick={() => setLaunchConfig({...launchConfig, image: img.id})}
                      className={`cursor-pointer border rounded-md p-3 flex items-center gap-3 transition-all ${launchConfig.image === img.id ? 'border-primary bg-primary/10' : 'border-border hover:border-text-tertiary bg-[#121214]'}`}
                    >
                      <span className="text-xl">{img.icon}</span>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-text-primary">{img.name}</span>
                        <span className="text-xs text-text-tertiary font-mono">{img.id}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Instance Type */}
              <div className="space-y-3">
                <label className="text-sm font-medium text-text-secondary">Instance Type</label>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { id: "t2.micro", name: "t2.micro", specs: "1 vCPU, 512MB RAM" },
                    { id: "t2.small", name: "t2.small", specs: "1 vCPU, 1GB RAM" },
                  ].map((type) => (
                    <div 
                      key={type.id}
                      onClick={() => setLaunchConfig({...launchConfig, instance_type: type.id})}
                      className={`cursor-pointer border rounded-md p-3 flex flex-col gap-1 transition-all ${launchConfig.instance_type === type.id ? 'border-primary bg-primary/10' : 'border-border hover:border-text-tertiary bg-[#121214]'}`}
                    >
                      <span className="text-sm font-bold text-text-primary flex items-center gap-1"><HardDrive size={14} className="text-text-secondary"/> {type.name}</span>
                      <span className="text-xs text-text-tertiary">{type.specs}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 border-t border-border bg-surface-active/30 flex justify-end gap-3">
              <Button variant="ghost" onClick={() => setIsLaunchOpen(false)}>Cancel</Button>
              <Button onClick={handleLaunch} disabled={loading}>
                {loading ? "Launching..." : "Launch Instance"}
              </Button>
            </div>
            
          </div>
        </div>
      )}

    </div>
  );
}
