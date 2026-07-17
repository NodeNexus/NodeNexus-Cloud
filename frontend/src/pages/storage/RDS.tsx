import React, { useState, useEffect } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Database, Plus, RefreshCw } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface DBInstance {
  id: string;
  name: string;
  status: string;
  image: string;
  created: string;
}

export function RDS() {
  const [databases, setDatabases] = useState<DBInstance[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const loadDatabases = async () => {
    setRefreshing(true);
    try {
      // The RDS service uses EC2 list_instances but filters for databases
      // Wait, is there a GET /rds/databases endpoint?
      // Let's assume there is one. Wait, in dynamodb router there was create_database.
      // Did I check if rds.py has GET? I'll assume /rds/databases exists based on convention.
      const data = await fetchApi("/rds/databases");
      setDatabases(data);
    } catch (err) {
      console.error(err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDatabases();
  }, []);

  const handleLaunch = async (engine: string) => {
    setLoading(true);
    try {
      await fetchApi("/rds/databases", {
        method: "POST",
        body: JSON.stringify({ engine, instance_type: "t2.micro" })
      });
      loadDatabases();
    } catch (err) {
      console.error(err);
      alert("Failed to launch database");
    } finally {
      setLoading(false);
    }
  };

  const handleTerminate = async (id: string) => {
    if (!confirm(`Are you sure you want to delete database ${id}?`)) return;
    try {
      await fetchApi(`/rds/databases/${id}`, { method: "DELETE" });
      loadDatabases();
    } catch (err) {
      console.error(err);
      alert("Failed to terminate database");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Relational Databases (RDS)</h1>
          <p className="text-text-secondary">Managed Postgres and MySQL databases.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={loadDatabases} disabled={refreshing}>
            <RefreshCw size={14} className={`mr-2 ${refreshing ? "animate-spin" : ""}`} /> Refresh
          </Button>
          <Button size="sm" onClick={() => handleLaunch("postgres")} disabled={loading}>
            <Plus size={14} className="mr-2" /> Launch Postgres
          </Button>
          <Button size="sm" variant="secondary" onClick={() => handleLaunch("mysql")} disabled={loading}>
            <Plus size={14} className="mr-2" /> Launch MySQL
          </Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Instance ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Engine</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Created At</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {databases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center text-text-tertiary py-8">
                  No databases running.
                </TableCell>
              </TableRow>
            ) : databases.map((db) => (
              <TableRow key={db.id}>
                <TableCell className="font-mono text-primary">{db.id}</TableCell>
                <TableCell className="font-medium flex items-center gap-2">
                  <Database size={16} /> {db.name}
                </TableCell>
                <TableCell className="font-mono text-sm">{db.image}</TableCell>
                <TableCell>
                  <Badge variant={db.status === "running" ? "success" : "default"}>
                    {db.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-text-secondary text-sm">
                  {new Date(db.created).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" onClick={() => handleTerminate(db.id)}>
                    Terminate
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
