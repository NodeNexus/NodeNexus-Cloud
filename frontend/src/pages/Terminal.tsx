import { useState } from 'react';
import { Plus, X, Terminal as TerminalIcon, RefreshCw, Download, Copy, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { XTermWrapper } from '../components/terminal/XTermWrapper';

interface Tab {
  id: string;
  title: string;
  cwd: string;
}

export const TerminalPage = () => {
  const [tabs, setTabs] = useState<Tab[]>([{ id: '1', title: 'Terminal 1', cwd: '/' }]);
  const [activeTab, setActiveTab] = useState('1');

  const addTab = () => {
    const newId = Date.now().toString();
    setTabs([...tabs, { id: newId, title: `Terminal ${tabs.length + 1}`, cwd: '/' }]);
    setActiveTab(newId);
  };

  const removeTab = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const newTabs = tabs.filter(t => t.id !== id);
    setTabs(newTabs);
    if (activeTab === id && newTabs.length > 0) {
      setActiveTab(newTabs[newTabs.length - 1].id);
    }
  };

  const clearTerminal = () => {
    // We could emit a special command or just reload the tab
    setTabs(tabs.map(t => t.id === activeTab ? { ...t, id: Date.now().toString() } : t));
  };

  return (
    <div className="flex flex-col h-full bg-black text-white p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-white/90">Terminal</h1>
        <div className="flex items-center gap-2">
          <button onClick={clearTerminal} className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-400 hover:text-white transition-colors" title="Clear Terminal">
            <Trash2 className="w-4 h-4" />
          </button>
          <button onClick={addTab} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors font-medium text-sm">
            <Plus className="w-4 h-4" />
            New Tab
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden shadow-2xl">
        {/* Tab Bar */}
        <div className="flex overflow-x-auto bg-zinc-950/80 border-b border-white/10 scrollbar-hide">
          <AnimatePresence mode="popLayout">
            {tabs.map(tab => (
              <motion.button
                key={tab.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 border-r border-white/5 min-w-[150px] transition-colors ${
                  activeTab === tab.id ? 'bg-white/10 text-white' : 'text-zinc-400 hover:bg-white/5'
                }`}
              >
                <TerminalIcon className="w-4 h-4" />
                <span className="flex-1 text-left text-sm font-medium truncate">{tab.title}</span>
                {tabs.length > 1 && (
                  <div 
                    onClick={(e) => removeTab(e, tab.id)}
                    className="p-1 rounded-md hover:bg-white/10 text-zinc-500 hover:text-rose-400 transition-colors"
                  >
                    <X className="w-3 h-3" />
                  </div>
                )}
              </motion.button>
            ))}
          </AnimatePresence>
        </div>

        {/* Terminal Area */}
        <div className="flex-1 p-2 relative bg-zinc-950">
          {tabs.map(tab => (
            <div 
              key={tab.id} 
              className={`absolute inset-2 transition-opacity duration-200 ${
                activeTab === tab.id ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'
              }`}
            >
              <XTermWrapper cwd={tab.cwd} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
