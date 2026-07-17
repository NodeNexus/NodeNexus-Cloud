import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Network, Plus, RefreshCw } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface NetworkInfo {
  id: string;
  name: string;
  driver: string;
}

export function VPC() {
  const [networks, setNetworks] = useState<NetworkInfo[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadNetworks = async () => {
    setRefreshing(true);
    try {
      const data = await fetchApi("/vpc/networks");
      setNetworks(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadNetworks();
  }, []);

  const handleCreate = async () => {
    const name = prompt("Enter network name (e.g. vnav-net-1):");
    if (!name) return;
    
    setLoading(true);
    try {
      await fetchApi("/vpc/networks", {
        method: "POST",
        body: JSON.stringify({ name, driver: "bridge" })
      });
      loadNetworks();
    } catch (err) {
      console.error(err);
      alert("Failed to create network");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete network ${name}?`)) return;
    try {
      await fetchApi(`/vpc/networks/${id}`, { method: "DELETE" });
      loadNetworks();
    } catch (err) {
      console.error(err);
      alert("Failed to delete network");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">VPC Networks</h1>
          <p className="text-text-secondary">Manage your Docker networks.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadNetworks} disabled={refreshing}>
            <RefreshCw size={14} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={handleCreate} disabled={loading}>
            <Plus size={14} className="mr-2" /> Create Network
          </Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Network ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Driver</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {networks.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-text-tertiary py-8">
                  No networks found.
                </TableCell>
              </TableRow>
            ) : networks.map((n) => (
              <TableRow key={n.id}>
                <TableCell className="font-mono text-primary">{n.id}</TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                  <Network size={16} /> {n.name}
                </TableCell>
                <TableCell className="text-text-secondary">{n.driver}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(n.id, n.name)}>
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
