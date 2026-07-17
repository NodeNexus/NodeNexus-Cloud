import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Play, Square, RefreshCw, Plus } from "lucide-react";
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
        body: JSON.stringify({ image: "nginx:alpine", instance_type: "t2.micro" })
      });
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">EC2 Instances</h1>
          <p className="text-text-secondary">Manage your Docker-backed virtual instances.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadInstances} disabled={refreshing}>
            <RefreshCw size={14} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={handleLaunch} disabled={loading}>
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
    </div>
  );
}
