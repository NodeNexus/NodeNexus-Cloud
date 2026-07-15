import React from "react";
import { Folder, File, Upload, Download, Trash, Edit2 } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";

const files = [
  { name: "docker-compose.yml", type: "file", size: "2.4 KB", modified: "Today, 10:23 AM" },
  { name: "nginx.conf", type: "file", size: "1.1 KB", modified: "Yesterday, 14:05 PM" },
  { name: "src", type: "folder", size: "--", modified: "Oct 12, 2023" },
  { name: "logs", type: "folder", size: "--", modified: "Oct 10, 2023" },
];

export function Files() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">File Explorer</h1>
          <p className="text-text-secondary">Manage local volume files.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm"><Upload size={14} className="mr-2" /> Upload</Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <div className="p-3 border-b border-border bg-surface-active/30 flex items-center gap-2 text-sm text-text-secondary font-mono">
          <span>/</span>
          <span className="hover:text-primary cursor-pointer transition-colors">var</span>
          <span>/</span>
          <span className="hover:text-primary cursor-pointer transition-colors">lib</span>
          <span>/</span>
          <span className="text-text-primary font-semibold">docker</span>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Last Modified</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {files.map((f) => (
              <TableRow key={f.name}>
                <TableCell className="font-medium flex items-center gap-3">
                  {f.type === "folder" ? <Folder className="text-info" size={18} /> : <File className="text-text-secondary" size={18} />}
                  {f.name}
                </TableCell>
                <TableCell className="text-text-secondary">{f.size}</TableCell>
                <TableCell className="text-text-secondary">{f.modified}</TableCell>
                <TableCell className="text-right space-x-2">
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-text-tertiary hover:text-text-primary"><Edit2 size={14} /></Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-text-tertiary hover:text-danger"><Trash size={14} /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
