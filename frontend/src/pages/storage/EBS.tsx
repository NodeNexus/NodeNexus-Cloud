import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Database, Plus, RefreshCw } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface Volume {
  name: string;
  driver: string;
}

export function EBS() {
  const [volumes, setVolumes] = useState<Volume[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadVolumes = async () => {
    setRefreshing(true);
    try {
      const data = await fetchApi("/ebs/volumes");
      setVolumes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadVolumes();
  }, []);

  const handleCreate = async () => {
    const name = prompt("Enter volume name (e.g. vol-data-1):");
    if (!name) return;
    
    setLoading(true);
    try {
      await fetchApi("/ebs/volumes", {
        method: "POST",
        body: JSON.stringify({ name })
      });
      loadVolumes();
    } catch (err) {
      console.error(err);
      alert("Failed to create volume");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm(`Are you sure you want to delete volume ${name}?`)) return;
    try {
      await fetchApi(`/ebs/volumes/${name}`, { method: "DELETE" });
      loadVolumes();
    } catch (err) {
      console.error(err);
      alert("Failed to delete volume");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">EBS Volumes</h1>
          <p className="text-text-secondary">Manage your persistent block storage volumes.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadVolumes} disabled={refreshing}>
            <RefreshCw size={14} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={handleCreate} disabled={loading}>
            <Plus size={14} className="mr-2" /> Create Volume
          </Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Volume Name</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {volumes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-text-tertiary py-8">
                  No volumes found.
                </TableCell>
              </TableRow>
            ) : volumes.map((v) => (
              <TableRow key={v.name}>
                <TableCell className="font-medium text-primary flex items-center gap-2">
                  <Database size={16} /> {v.name}
                </TableCell>
                <TableCell className="text-text-secondary">{v.driver}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(v.name)}>
                    Delete
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
