import React from 'react';
import { FileInfo } from '../../api/files';
import { Folder, File as FileIcon, ChevronRight, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FileExplorerProps {
  tree: FileInfo | null;
  onSelect: (file: FileInfo) => void;
  selectedPath: string;
}

const TreeNode: React.FC<{ 
  node: FileInfo, 
  level: number, 
  onSelect: (file: FileInfo) => void,
  selectedPath: string 
}> = ({ node, level, onSelect, selectedPath }) => {
  const [isOpen, setIsOpen] = React.useState(level < 1);
  const isSelected = selectedPath === node.path;

  if (!node.is_dir) {
    return (
      <div 
        onClick={() => onSelect(node)}
        className={`flex items-center gap-2 py-1 px-2 hover:bg-white/10 cursor-pointer rounded-md text-sm transition-colors ${isSelected ? 'bg-white/20 text-white' : 'text-zinc-400'}`}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
      >
        <FileIcon className="w-4 h-4 text-blue-400" />
        <span className="truncate">{node.name}</span>
      </div>
    );
  }

  return (
    <div>
      <div 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 py-1 px-2 hover:bg-white/10 cursor-pointer rounded-md text-sm text-zinc-300 transition-colors group"
        style={{ paddingLeft: `${level * 16}px` }}
      >
        {isOpen ? <ChevronDown className="w-4 h-4 text-zinc-500" /> : <ChevronRight className="w-4 h-4 text-zinc-500" />}
        <Folder className="w-4 h-4 text-yellow-500 group-hover:text-yellow-400" />
        <span className="truncate font-medium">{node.name || "workspace"}</span>
      </div>
      <AnimatePresence>
        {isOpen && node.children && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {node.children.map(child => (
              <TreeNode key={child.path} node={child} level={level + 1} onSelect={onSelect} selectedPath={selectedPath} />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export const FileExplorer: React.FC<FileExplorerProps> = ({ tree, onSelect, selectedPath }) => {
  return (
    <div className="w-64 h-full bg-zinc-950/80 border-r border-white/10 flex flex-col backdrop-blur-xl">
      <div className="p-3 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-white/10">
        Explorer
      </div>
      <div className="flex-1 overflow-y-auto p-2 scrollbar-hide">
        {tree ? (
          <TreeNode node={tree} level={0} onSelect={onSelect} selectedPath={selectedPath} />
        ) : (
          <div className="p-4 text-center text-zinc-600 text-sm">Loading...</div>
        )}
      </div>
    </div>
  );
};
