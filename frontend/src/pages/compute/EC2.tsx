import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { Play, Square, RefreshCw, Plus } from "lucide-react";

const instances = [
  { id: "i-09f3b2a", name: "vnav-web-backend", type: "t2.micro", status: "running", ip: "172.18.0.3" },
  { id: "i-02a8c91", name: "vnav-web-frontend", type: "t2.micro", status: "running", ip: "172.18.0.4" },
  { id: "i-05b1f7e", name: "worker-node-1", type: "t2.small", status: "stopped", ip: "-" },
];

export function EC2() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">EC2 Instances</h1>
          <p className="text-text-secondary">Manage your Docker-backed virtual instances.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm"><RefreshCw size={14} className="mr-2" /> Refresh</Button>
          <Button size="sm"><Plus size={14} className="mr-2" /> Launch Instance</Button>
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
              <TableHead>Instance Type</TableHead>
              <TableHead>State</TableHead>
              <TableHead>Private IP</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {instances.map((i) => (
              <TableRow key={i.id}>
                <TableCell><input type="checkbox" className="rounded border-border bg-surface-active" /></TableCell>
                <TableCell className="font-mono text-primary">{i.id}</TableCell>
                <TableCell className="font-medium">{i.name}</TableCell>
                <TableCell>{i.type}</TableCell>
                <TableCell>
                  <Badge variant={i.status === "running" ? "success" : "default"}>
                    {i.status}
                  </Badge>
                </TableCell>
                <TableCell className="font-mono text-text-secondary">{i.ip}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm">Manage</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
