const API_BASE = "http://127.0.0.1:8000/files"; // Assuming backend is on port 8000

export interface FileInfo {
  name: string;
  path: string;
  is_dir: bool;
  size: number;
  modified: number;
  children?: FileInfo[]; // for tree
}

export const filesApi = {
  getTree: async (path: string = ""): Promise<FileInfo> => {
    const res = await fetch(`${API_BASE}/tree?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error("Failed to fetch tree");
    return res.json();
  },
  readFile: async (path: string): Promise<string> => {
    const res = await fetch(`${API_BASE}/read?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error("Failed to read file");
    const data = await res.json();
    return data.content;
  },
  writeFile: async (path: string, content: string): Promise<FileInfo> => {
    const res = await fetch(`${API_BASE}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content })
    });
    if (!res.ok) throw new Error("Failed to write file");
    return res.json();
  },
  mkdir: async (path: string, name: string): Promise<FileInfo> => {
    const res = await fetch(`${API_BASE}/mkdir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, name })
    });
    if (!res.ok) throw new Error("Failed to create directory");
    return res.json();
  },
  rename: async (path: string, new_name: string): Promise<FileInfo> => {
    const res = await fetch(`${API_BASE}/rename`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, new_name })
    });
    if (!res.ok) throw new Error("Failed to rename");
    return res.json();
  },
  delete: async (path: string): Promise<void> => {
    const res = await fetch(`${API_BASE}/delete`, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path })
    });
    if (!res.ok) throw new Error("Failed to delete");
  },
  upload: async (file: File, dest_path: string): Promise<FileInfo> => {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("dest_path", dest_path);
    const res = await fetch(`${API_BASE}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error("Failed to upload");
    return res.json();
  }
};
