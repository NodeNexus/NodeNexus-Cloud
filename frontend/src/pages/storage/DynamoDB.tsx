import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { RefreshCw, Plus, Database } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface TableInstance {
  id: string;
  name: string;
  status: string;
  image: string;
  created: string;
}

export function DynamoDB() {
  const [tables, setTables] = useState<TableInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadTables = async () => {
    setRefreshing(true);
    try {
      const data = await fetchApi("/dynamodb/tables");
      setTables(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadTables();
  }, []);

  const handleLaunch = async (engine: "mongo" | "redis") => {
    setLoading(true);
    try {
      await fetchApi("/dynamodb/tables", {
        method: "POST",
        body: JSON.stringify({ 
          name: `table-${Math.random().toString(36).substring(7)}`, 
          engine, 
          instance_type: "t2.micro" 
        })
      });
      loadTables();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await fetchApi(`/dynamodb/tables/${id}`, { method: "DELETE" });
      loadTables();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">DynamoDB Tables (NoSQL)</h1>
          <p className="text-text-secondary">Manage your key-value and document databases.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadTables} disabled={refreshing}>
            <RefreshCw size={14} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <div className="flex gap-2">
            <Button size="sm" onClick={() => handleLaunch("mongo")} disabled={loading} className="bg-[#47A248] hover:bg-[#3d8b3e] text-white">
              <Plus size={14} className="mr-2" /> New Mongo DB
            </Button>
            <Button size="sm" onClick={() => handleLaunch("redis")} disabled={loading} className="bg-[#DC382D] hover:bg-[#c03127] text-white">
              <Plus size={14} className="mr-2" /> New Redis DB
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="p-4 border-b border-border flex items-center gap-2">
          <Button variant="secondary" size="sm" disabled><Database size={14} className="mr-2" /> Explore Items</Button>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12"><input type="checkbox" className="rounded border-border bg-surface-active" /></TableHead>
              <TableHead>Instance ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Engine</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tables.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center text-text-tertiary py-8">
                  No tables found. Create one to get started.
                </TableCell>
              </TableRow>
            ) : tables.map((t) => (
              <TableRow key={t.id}>
                <TableCell><input type="checkbox" className="rounded border-border bg-surface-active" /></TableCell>
                <TableCell className="font-mono text-primary">{t.id}</TableCell>
                <TableCell className="font-medium">{t.name}</TableCell>
                <TableCell className="font-mono text-sm">
                  {t.image.includes("mongo") ? (
                    <span className="text-[#47A248] font-bold">MongoDB</span>
                  ) : (
                    <span className="text-[#DC382D] font-bold">Redis</span>
                  )}
                </TableCell>
                <TableCell>
                  <Badge variant={t.status === "running" ? "success" : "default"}>
                    {t.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-sm">{new Date(t.created).toLocaleString()}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="sm" onClick={() => handleDelete(t.id)}>Delete</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
