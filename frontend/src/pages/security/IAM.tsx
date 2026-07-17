import React, { useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { User, Plus } from "lucide-react";
import { fetchApi } from "@/lib/api";

interface IAMUser {
  email: string;
  role: string;
  status: string;
}

export function IAM() {
  const [users, setUsers] = useState<IAMUser[]>([]);
  const [loading, setLoading] = useState(false);

  // In the real IAM router there's no GET /users yet, only POST /users.
  // We'll leave the array empty for now and just allow registration.

  const handleCreate = async () => {
    const email = prompt("Enter new user email:");
    if (!email) return;
    const password = prompt("Enter temporary password:");
    if (!password) return;
    
    setLoading(true);
    try {
      const res = await fetchApi("/iam/users", {
        method: "POST",
        body: JSON.stringify({ email, password, role: "user" })
      });
      setUsers([...users, res]);
    } catch (err) {
      console.error(err);
      alert("Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">IAM Users</h1>
          <p className="text-text-secondary">Identity and Access Management.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={handleCreate} disabled={loading}>
            <Plus size={14} className="mr-2" /> Create User
          </Button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-text-tertiary py-8">
                  No recently created users in this session.
                </TableCell>
              </TableRow>
            ) : users.map((u, idx) => (
              <TableRow key={idx}>
                <TableCell className="font-medium text-primary flex items-center gap-2">
                  <User size={16} /> {u.email}
                </TableCell>
                <TableCell className="text-text-secondary">{u.role}</TableCell>
                <TableCell className="text-text-secondary">{u.status}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
