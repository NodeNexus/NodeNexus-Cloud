import { Settings as SettingsIcon, Moon, Sun, Monitor, Keyboard, Terminal } from 'lucide-react';
import { useTheme } from '../providers/ThemeProvider';
import { useKeyboardShortcut } from '../hooks/useKeyboardShortcut';

export const Settings = () => {
  const { theme, setTheme } = useTheme();

  // Test the shortcut hook
  useKeyboardShortcut(['ctrl', 's'], () => {
    alert("Settings saved via keyboard shortcut!");
  });

  return (
    <div className="flex flex-col h-full bg-black text-white p-8 overflow-y-auto dark:bg-black dark:text-white bg-white text-black transition-colors duration-300">
      <div className="flex items-center gap-3 mb-8">
        <SettingsIcon className="w-8 h-8 text-zinc-400" />
        <h1 className="text-3xl font-bold tracking-tight text-white/90">System Preferences</h1>
      </div>

      <div className="max-w-4xl grid gap-8">
        {/* Appearance Settings */}
        <section className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Monitor className="w-5 h-5 text-indigo-400"/> Appearance
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <button 
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${theme === 'light' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-black/50 border-white/10 hover:border-white/20'}`}
            >
              <Sun className="w-6 h-6" /> Light
            </button>
            <button 
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${theme === 'dark' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-black/50 border-white/10 hover:border-white/20'}`}
            >
              <Moon className="w-6 h-6" /> Dark
            </button>
            <button 
              onClick={() => setTheme('system')}
              className={`p-4 rounded-2xl border transition-all flex flex-col items-center gap-2 ${theme === 'system' ? 'bg-indigo-500/10 border-indigo-500 text-indigo-400' : 'bg-black/50 border-white/10 hover:border-white/20'}`}
            >
              <Monitor className="w-6 h-6" /> System
            </button>
          </div>
        </section>

        {/* Keyboard Shortcuts */}
        <section className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Keyboard className="w-5 h-5 text-emerald-400"/> Keyboard Shortcuts
          </h2>
          <div className="space-y-2">
            <div className="flex justify-between items-center p-3 bg-black/50 rounded-xl">
              <span className="text-sm font-medium">Save Settings</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-xs">Ctrl</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-xs">S</kbd>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/50 rounded-xl">
              <span className="text-sm font-medium">Global Search</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-xs">Ctrl</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-xs">K</kbd>
              </div>
            </div>
            <div className="flex justify-between items-center p-3 bg-black/50 rounded-xl">
              <span className="text-sm font-medium">Open Terminal</span>
              <div className="flex gap-1">
                <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-xs">Ctrl</kbd>
                <kbd className="px-2 py-1 bg-white/10 rounded font-mono text-xs">`</kbd>
              </div>
            </div>
          </div>
        </section>

        {/* Advanced */}
        <section className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <Terminal className="w-5 h-5 text-rose-400"/> Advanced
          </h2>
          <div className="p-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl flex justify-between items-center">
            <div>
              <div className="font-bold text-rose-400 mb-1">Factory Reset</div>
              <div className="text-sm text-zinc-400">Permanently delete all VNAV Cloud data, databases, and containers.</div>
            </div>
            <button className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white font-bold rounded-xl transition-colors">
              Reset System
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};
