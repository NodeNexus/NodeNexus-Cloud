import React, { useState, useEffect } from 'react';
import Editor, { useMonaco } from '@monaco-editor/react';
import { Save, X } from 'lucide-react';

interface FileEditorProps {
  path: string;
  initialContent: string;
  onSave: (path: string, content: string) => void;
  onClose: (path: string) => void;
}

const getLanguageFromPath = (path: string) => {
  const ext = path.split('.').pop()?.toLowerCase();
  switch (ext) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'json': return 'json';
    case 'md': return 'markdown';
    case 'py': return 'python';
    case 'css': return 'css';
    case 'html': return 'html';
    case 'xml': return 'xml';
    case 'yaml':
    case 'yml': return 'yaml';
    case 'sql': return 'sql';
    default: return 'plaintext';
  }
};

export const FileEditor: React.FC<FileEditorProps> = ({ path, initialContent, onSave, onClose }) => {
  const [content, setContent] = useState(initialContent);
  const [isDirty, setIsDirty] = useState(false);
  const monaco = useMonaco();
  const language = getLanguageFromPath(path);

  useEffect(() => {
    setContent(initialContent);
    setIsDirty(false);
  }, [initialContent, path]);

  useEffect(() => {
    if (monaco) {
      monaco.editor.defineTheme('vnav-dark', {
        base: 'vs-dark',
        inherit: true,
        rules: [],
        colors: {
          'editor.background': '#09090b', // zinc-950
          'editor.lineHighlightBackground': '#27272a',
        },
      });
      monaco.editor.setTheme('vnav-dark');
    }
  }, [monaco]);

  const handleSave = () => {
    onSave(path, content);
    setIsDirty(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      handleSave();
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-zinc-950 text-white" onKeyDown={handleKeyDown}>
      <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{path.split('/').pop()}</span>
          {isDirty && <div className="w-2 h-2 rounded-full bg-blue-500" title="Unsaved changes"></div>}
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleSave} 
            disabled={!isDirty}
            className={`p-1.5 rounded hover:bg-white/10 transition-colors ${isDirty ? 'text-blue-400' : 'text-zinc-500'}`}
            title="Save (Ctrl+S)"
          >
            <Save className="w-4 h-4" />
          </button>
          <button 
            onClick={() => onClose(path)}
            className="p-1.5 rounded hover:bg-white/10 hover:text-rose-400 text-zinc-400 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="flex-1 w-full h-full">
        <Editor
          height="100%"
          language={language}
          theme="vnav-dark"
          value={content}
          onChange={(val) => {
            setContent(val || "");
            setIsDirty(val !== initialContent);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 14,
            fontFamily: 'Menlo, Monaco, "Courier New", monospace',
            wordWrap: 'on',
            padding: { top: 16 }
          }}
        />
      </div>
    </div>
  );
};
