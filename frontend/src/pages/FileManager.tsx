import React, { useState, useEffect } from 'react';
import { FileExplorer } from '../components/files/FileExplorer';
import { FileEditor } from '../components/files/FileEditor';
import { filesApi, FileInfo } from '../api/files';
import { RefreshCw } from 'lucide-react';

export const FileManager = () => {
  const [tree, setTree] = useState<FileInfo | null>(null);
  const [activeFiles, setActiveFiles] = useState<{ path: string; content: string }[]>([]);
  const [activePath, setActivePath] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const loadTree = async () => {
    setLoading(true);
    try {
      const data = await filesApi.getTree();
      setTree(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTree();
  }, []);

  const handleSelect = async (file: FileInfo) => {
    if (file.is_dir) return; // For now only open files

    // If already open, just switch to it
    if (activeFiles.some(f => f.path === file.path)) {
      setActivePath(file.path);
      return;
    }

    try {
      const content = await filesApi.readFile(file.path);
      setActiveFiles([...activeFiles, { path: file.path, content }]);
      setActivePath(file.path);
    } catch (e) {
      console.error("Failed to open file", e);
    }
  };

  const handleSave = async (path: string, content: string) => {
    try {
      await filesApi.writeFile(path, content);
      // Update local state
      setActiveFiles(activeFiles.map(f => f.path === path ? { ...f, content } : f));
    } catch (e) {
      console.error("Failed to save file", e);
    }
  };

  const handleClose = (path: string) => {
    const newFiles = activeFiles.filter(f => f.path !== path);
    setActiveFiles(newFiles);
    if (activePath === path && newFiles.length > 0) {
      setActivePath(newFiles[newFiles.length - 1].path);
    } else if (newFiles.length === 0) {
      setActivePath("");
    }
  };

  const activeFile = activeFiles.find(f => f.path === activePath);

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white/90">File Manager</h1>
        <button 
          onClick={loadTree} 
          disabled={loading}
          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      <div className="flex-1 flex overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/50 backdrop-blur-xl shadow-2xl">
        {/* Sidebar Explorer */}
        <FileExplorer 
          tree={tree} 
          onSelect={handleSelect} 
          selectedPath={activePath} 
        />
        
        {/* Editor Area */}
        <div className="flex-1 h-full bg-zinc-950">
          {activeFile ? (
            <FileEditor 
              path={activeFile.path} 
              initialContent={activeFile.content} 
              onSave={handleSave}
              onClose={handleClose}
            />
          ) : (
            <div className="flex items-center justify-center h-full text-zinc-500 flex-col gap-4">
              <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center">
                <svg className="w-8 h-8 text-zinc-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <p>Select a file to edit</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
