import { useState } from 'react';
import { ChatInterface } from '../../components/ai/ChatInterface';
import { MessageSquare, Settings, History, Plus } from 'lucide-react';

export const AI = () => {

  return (
    <div className="flex h-full bg-black text-white p-4 gap-4">
      
      {/* AI Sidebar */}
      <div className="w-64 bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-4 flex flex-col hidden md:flex">
        <button className="flex items-center gap-2 justify-center w-full py-3 mb-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white rounded-xl font-medium transition-all shadow-lg">
          <Plus className="w-4 h-4" /> New Chat
        </button>
        
        <div className="flex-1 overflow-y-auto space-y-1 pr-2">
          <div className="text-xs font-bold text-zinc-500 uppercase tracking-wider mb-2 px-2">Recent</div>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl bg-white/10 text-white">
            <MessageSquare className="w-4 h-4 text-blue-400" />
            <span className="truncate text-sm">Cluster Health Check</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-zinc-400 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="truncate text-sm">Grafana Installation</span>
          </button>
          
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-zinc-400 transition-colors">
            <MessageSquare className="w-4 h-4" />
            <span className="truncate text-sm">Debug Nginx Pod</span>
          </button>
        </div>
        
        <div className="mt-4 pt-4 border-t border-white/10 space-y-1">
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-zinc-400 transition-colors">
            <History className="w-4 h-4" />
            <span className="text-sm">All History</span>
          </button>
          <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-white/5 text-zinc-400 transition-colors">
            <Settings className="w-4 h-4" />
            <span className="text-sm">AI Settings</span>
          </button>
        </div>
      </div>
      
      {/* Main Chat Area */}
      <div className="flex-1 relative">
        <ChatInterface />
      </div>
    </div>
  );
};
