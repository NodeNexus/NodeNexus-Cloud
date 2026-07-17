import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RefreshCw, Plus, Link as LinkIcon, Trash } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface Route {
  id: string;
  path: string;
  target_name: string;
  target_ip: string;
  target_port: number;
}

interface Container {
  id: string;
  name: string;
}

export function APIGateway() {
  const [routes, setRoutes] = useState<Route[]>([]);
  const [containers, setContainers] = useState<Container[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  // Form states
  const [path, setPath] = useState("");
  const [targetContainer, setTargetContainer] = useState("");
  const [targetPort, setTargetPort] = useState(80);

  const loadData = async () => {
    setRefreshing(true);
    try {
      const [routesData, containersData] = await Promise.all([
        fetchApi("/gateway/routes"),
        fetchApi("/system/containers")
      ]);
      setRoutes(routesData);
      setContainers(containersData);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleCreateRoute = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!path || !targetContainer) return;
    
    setLoading(true);
    try {
      await fetchApi("/gateway/routes", {
        method: "POST",
        body: JSON.stringify({ 
          path, 
          target_container_id: targetContainer,
          target_port: targetPort
        })
      });
      setPath("");
      loadData();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchApi(`/gateway/routes/${id}`, { method: "DELETE" });
      loadData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">API Gateway</h1>
          <p className="text-text-secondary">Route external traffic to your containers via Nginx.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadData} disabled={refreshing}>
            <RefreshCw size={14} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg p-6">
        <h2 className="text-lg font-semibold mb-4">Create New Route</h2>
        <form onSubmit={handleCreateRoute} className="flex gap-4 items-end">
          <div className="flex-1 space-y-2">
            <label className="text-sm text-text-secondary">Path (e.g. /api)</label>
            <input 
              required
              type="text" 
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:border-primary outline-none"
              value={path}
              onChange={e => setPath(e.target.value)}
              placeholder="/my-app"
            />
          </div>
          <div className="flex-1 space-y-2">
            <label className="text-sm text-text-secondary">Target Container</label>
            <select 
              required
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:border-primary outline-none text-text-primary"
              value={targetContainer}
              onChange={e => setTargetContainer(e.target.value)}
            >
              <option value="">Select container...</option>
              {containers.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="w-24 space-y-2">
            <label className="text-sm text-text-secondary">Port</label>
            <input 
              required
              type="number" 
              className="w-full bg-background border border-border rounded-md px-3 py-2 text-sm focus:border-primary outline-none"
              value={targetPort}
              onChange={e => setTargetPort(parseInt(e.target.value))}
            />
          </div>
          <Button type="submit" disabled={loading || !path || !targetContainer}>
            <Plus size={14} className="mr-2" /> Add Route
          </Button>
        </form>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled><LinkIcon size={14} className="mr-2" /> View Gateway Logs</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Route Path</TableHead>
              <TableHead>Target Container</TableHead>
              <TableHead>Target IP:Port</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {routes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-text-tertiary py-8">
                  No routes configured. The Gateway (localhost:8080) will return 404 for all requests.
                </TableCell>
              </TableRow>
            ) : routes.map((r) => (
              <TableRow key={r.id}>
                <TableCell className="font-mono text-primary font-bold">{r.path}</TableCell>
                <TableCell className="font-medium">{r.target_name}</TableCell>
                <TableCell className="font-mono text-sm text-text-secondary">
                  {r.target_ip}:{r.target_port}
                </TableCell>
                <TableCell>
                  <Badge variant="success">Active</Badge>
                </TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" className="text-danger" onClick={() => handleDelete(r.id)}>
                    <Trash size={14} />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
