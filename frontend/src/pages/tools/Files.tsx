import React, { useState, useEffect } from "react";
import { Folder, File, Upload, CornerLeftUp, AlertTriangle, RefreshCw } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/Table";
import { Button } from "@/components/ui/Button";
import { fetchApi, BASE_URL } from "@/lib/api";

interface FileItem {
  name: string;
  type: "file" | "folder";
  size: string;
  modified: string;
}

interface Container {
  id: string;
  name: string;
}

export function Files() {
  const [containers, setContainers] = useState<Container[]>([]);
  const [selectedContainer, setSelectedContainer] = useState<string>("");
  const [currentPath, setCurrentPath] = useState<string>("/tmp");
  const [files, setFiles] = useState<FileItem[]>([]);
  const [loading, setLoading] = useState(false);
  // P3: Track fetch errors (e.g., container stopped between selection and list)
  const [fileError, setFileError] = useState<string | null>(null);

  useEffect(() => {
    fetchApi("/system/containers").then(setContainers).catch(console.error);
  }, []);

  const loadFiles = async () => {
    if (!selectedContainer) return;
    setLoading(true);
    setFileError(null);
    try {
      const data = await fetchApi(`/files/${selectedContainer}/list?path=${encodeURIComponent(currentPath)}`);
      setFiles(data);
    } catch (err: any) {
      // P3: Distinguish container-stopped errors from generic failures
      const msg = err?.message || "Unknown error";
      if (msg.includes("not found") || msg.includes("404")) {
        setFileError("Container not found or has stopped. Select another container.");
      } else {
        setFileError(`Could not list directory: ${msg}`);
      }
      setFiles([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFiles();
  }, [selectedContainer, currentPath]);

  const handleNavigate = (folderName: string) => {
    let newPath = currentPath;
    if (newPath.endsWith("/")) newPath += folderName;
    else newPath += "/" + folderName;
    setCurrentPath(newPath);
  };

  const handleGoUp = () => {
    if (currentPath === "/" || currentPath === "") return;
    const parts = currentPath.split("/").filter(Boolean);
    parts.pop();
    setCurrentPath("/" + parts.join("/"));
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files.length || !selectedContainer) return;
    
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("file", file);
    formData.append("path", currentPath);

    try {
      setLoading(true);
      await fetch(`${BASE_URL}/api/files/${selectedContainer}/upload`, {
        method: "POST",
        body: formData,
      });
      loadFiles();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-text-primary">File Explorer</h1>
          <p className="text-text-secondary">Manage files directly inside your running containers.</p>
        </div>
        <div className="flex items-center gap-2">
          <select 
            className="bg-surface text-text-primary border border-border rounded-md px-3 py-1.5 text-sm outline-none focus:border-primary"
            value={selectedContainer}
            onChange={(e) => setSelectedContainer(e.target.value)}
          >
            <option value="">Select container...</option>
            {containers.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
          
          <label className="cursor-pointer inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-surface-hover text-text-primary h-9 px-3 py-2 gap-2">
            <Upload size={14} /> Upload
            <input type="file" className="hidden" onChange={handleUpload} disabled={!selectedContainer} />
          </label>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-lg overflow-hidden min-h-[400px]">
        <div className="p-3 border-b border-border bg-surface-active/30 flex items-center gap-2 text-sm text-text-secondary font-mono">
          <Button variant="ghost" size="sm" onClick={handleGoUp} disabled={currentPath === "/" || !selectedContainer} className="h-6 px-2 mr-2">
            <CornerLeftUp size={14} />
          </Button>
          <span className="text-text-primary font-semibold">{currentPath}</span>
        </div>
        
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Size</TableHead>
              <TableHead>Last Modified</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {!selectedContainer ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-text-tertiary py-12">
                  Select a container to view its files.
                </TableCell>
              </TableRow>
            ) : fileError ? (
              <TableRow>
                <TableCell colSpan={3}>
                  <div className="flex flex-col items-center gap-3 py-10 text-danger">
                    <AlertTriangle size={28} />
                    <p className="text-sm font-semibold">{fileError}</p>
                    <Button variant="outline" size="sm" onClick={loadFiles}>
                      <RefreshCw size={12} className="mr-2" /> Retry
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ) : files.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-text-tertiary py-8">
                  {loading ? "Loading..." : "This directory is empty."}
                </TableCell>
              </TableRow>
            ) : files.map((f) => (
              <TableRow key={f.name}>
                <TableCell className="font-medium flex items-center gap-3">
                  {f.type === "folder" ? (
                    <div className="flex items-center gap-3 cursor-pointer hover:text-primary transition-colors" onClick={() => handleNavigate(f.name)}>
                      <Folder className="text-info" size={18} /> {f.name}
                    </div>
                  ) : (
                    <div className="flex items-center gap-3">
                      <File className="text-text-secondary" size={18} /> {f.name}
                    </div>
                  )}
                </TableCell>
                <TableCell className="text-text-secondary font-mono text-sm">{f.size}</TableCell>
                <TableCell className="text-text-secondary text-sm">{f.modified}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
