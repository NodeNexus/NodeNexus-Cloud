import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RefreshCw, Box, Play } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface ContainerService {
  id: string;
  name: string;
  status: string;
  image: string;
  cluster: string;
  created: string;
}

export function Containers() {
  const [services, setServices] = useState<ContainerService[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadServices = async () => {
    setRefreshing(true);
    try {
      const data = await fetchApi("/containers/services");
      setServices(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleDeploy = async (image: string, name: string) => {
    setLoading(true);
    try {
      await fetchApi("/containers/services", {
        method: "POST",
        body: JSON.stringify({ 
          name, 
          image, 
          cluster: "production" 
        })
      });
      loadServices();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleStop = async (id: string) => {
    try {
      await fetchApi(`/containers/services/${id}`, { method: "DELETE" });
      loadServices();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Container Orchestration</h1>
          <p className="text-text-secondary">Manage clusters and containerized applications.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadServices} disabled={refreshing}>
            <RefreshCw size={14} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleDeploy("nginx:alpine", "web")} disabled={loading}>
              <Play size={14} className="mr-2" /> Deploy NGINX
            </Button>
            <Button size="sm" onClick={() => handleDeploy("redis:alpine", "cache")} disabled={loading} variant="secondary">
              <Play size={14} className="mr-2" /> Deploy Redis
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled><Box size={14} className="mr-2" /> View Clusters</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><input type="checkbox" className="rounded border-border bg-surface-active" /></TableHead>
              <TableHead>Service ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Image</TableHead>
              <TableHead>Cluster</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {services.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center text-text-tertiary py-8">
                  No container services running. Deploy an image to get started.
                </TableCell>
              </TableRow>
            ) : services.map((s) => (
              <TableRow key={s.id}>
                <TableCell><input type="checkbox" className="rounded border-border bg-surface-active" /></TableCell>
                <TableCell className="font-mono text-primary">{s.id}</TableCell>
                <TableCell className="font-medium">{s.name}</TableCell>
                <TableCell className="font-mono text-sm">{s.image}</TableCell>
                <TableCell><Badge variant="outline">{s.cluster}</Badge></TableCell>
                <TableCell>
                  <Badge variant={s.status === "running" ? "success" : "default"}>
                    {s.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-sm">{new Date(s.created).toLocaleString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleStop(s.id)}>Stop & Remove</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
