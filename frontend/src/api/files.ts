import { API_BASE } from './client';
const API_URL = `${API_BASE}/files`;

export interface FileInfo {
  name: string;
  path: string;
  is_dir: boolean;
  size: number;
  modified: number;
  children?: FileInfo[]; // for tree
}

export const filesApi = {
  getTree: async (path: string = ""): Promise<FileInfo> => {
    const res = await fetch(`${API_URL}/tree?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error("Failed to fetch tree");
    return res.json();
  },
  readFile: async (path: string): Promise<string> => {
    const res = await fetch(`${API_URL}/read?path=${encodeURIComponent(path)}`);
    if (!res.ok) throw new Error("Failed to read file");
    const data = await res.json();
    return data.content;
  },
  writeFile: async (path: string, content: string): Promise<FileInfo> => {
    const res = await fetch(`${API_URL}/write`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, content })
    });
    if (!res.ok) throw new Error("Failed to write file");
    return res.json();
  },
  mkdir: async (path: string, name: string): Promise<FileInfo> => {
    const res = await fetch(`${API_URL}/mkdir`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, name })
    });
    if (!res.ok) throw new Error("Failed to create directory");
    return res.json();
  },
  rename: async (path: string, new_name: string): Promise<FileInfo> => {
    const res = await fetch(`${API_URL}/rename`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, new_name })
    });
    if (!res.ok) throw new Error("Failed to rename");
    return res.json();
  },
  delete: async (path: string): Promise<void> => {
    const res = await fetch(`${API_URL}/delete`, {
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
    const res = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      body: formData
    });
    if (!res.ok) throw new Error("Failed to upload");
    return res.json();
  }
};
