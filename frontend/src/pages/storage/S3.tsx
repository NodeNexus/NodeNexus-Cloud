import React from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { HardDrive, Plus } from "lucide-react";

const buckets = [
  { name: "vnav-assets", region: "us-east-pi", created: "2023-10-15", access: "Public" },
  { name: "vnav-backups", region: "us-east-pi", created: "2023-11-01", access: "Private" },
];

export function S3() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">S3 Buckets</h1>
          <p className="text-text-secondary">Object storage powered by MinIO.</p>
        </div>
        <Button size="sm"><Plus size={14} className="mr-2" /> Create Bucket</Button>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Region</TableHead>
              <TableHead>Access</TableHead>
              <TableHead>Creation Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {buckets.map((b) => (
              <TableRow key={b.name}>
                <TableCell className="font-medium text-primary flex items-center gap-2">
                  <HardDrive size={16} /> {b.name}
                </TableCell>
                <TableCell>{b.region}</TableCell>
                <TableCell>{b.access}</TableCell>
                <TableCell className="text-text-secondary">{b.created}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
