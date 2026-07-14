import { useState, useEffect } from 'react';
import { useStore } from '../store/useStore';
import { pluginsApi } from '../api/plugins';
import { DownloadCloud, Trash2, RefreshCw, Search, PackageOpen, Loader2 } from 'lucide-react';
import { motion } from 'framer-motion';

export const Marketplace = () => {
  const { token } = useStore();
  const [plugins, setPlugins] = useState<any[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchPlugins = () => {
    pluginsApi.getPlugins(token)
      .then(data => {
        setPlugins(data);
        const cats = Array.from(new Set(data.map((p: any) => p.manifest.category)));
        setCategories(cats as string[]);
        setLoading(false);
      })
      .catch(console.error);
  };

  useEffect(() => {
    fetchPlugins();
  }, [token, fetchPlugins]);

  const handleInstall = async (id: string) => {
    setActionLoading(id);
    try {
      await pluginsApi.installPlugin(token, id);
      fetchPlugins();
    } catch (e) {
      console.error("Install failed", e);
    } finally {
      setActionLoading(null);
    }
  };

  const handleUninstall = async (id: string) => {
    setActionLoading(id);
    try {
      await pluginsApi.uninstallPlugin(token, id);
      fetchPlugins();
    } catch (e) {
      console.error("Uninstall failed", e);
    } finally {
      setActionLoading(null);
    }
  };

  const filteredPlugins = plugins.filter(p => {
    const matchesSearch = p.manifest.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = selectedCategory ? p.manifest.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <h1 className="text-3xl font-bold tracking-tight text-white/90">Marketplace</h1>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
            <input 
              type="text" 
              placeholder="Search plugins..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 pr-4 py-2 bg-zinc-900 border border-white/10 rounded-xl focus:outline-none focus:border-blue-500 text-sm w-64"
            />
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        <button 
          onClick={() => setSelectedCategory(null)}
          className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${!selectedCategory ? 'bg-white text-black' : 'bg-white/10 text-zinc-300 hover:bg-white/20'}`}
        >
          All
        </button>
        {categories.map(cat => (
          <button 
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-white text-black' : 'bg-white/10 text-zinc-300 hover:bg-white/20'}`}
          >
            {cat}
          </button>
        ))}
      </div>
      
      {loading ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
          <Loader2 className="w-10 h-10 animate-spin mb-4" />
          <p>Loading plugin registry...</p>
        </div>
      ) : filteredPlugins.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center text-zinc-500">
          <PackageOpen className="w-16 h-16 mb-4 opacity-50" />
          <p>No plugins found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredPlugins.map(p => (
            <motion.div key={p.manifest.id} whileHover={{ y: -5 }} className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl flex flex-col relative overflow-hidden group">
              {p.installed && (
                <div className="absolute top-0 right-0 w-32 h-32 blur-3xl opacity-20 bg-emerald-500 rounded-full"></div>
              )}
              
              <div className="flex items-center gap-4 mb-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center font-bold text-xl uppercase">
                  {p.manifest.name.substring(0, 2)}
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">{p.manifest.name}</h3>
                  <div className="text-zinc-500 text-xs">v{p.manifest.version} | {p.manifest.category}</div>
                </div>
              </div>
              
              <p className="text-zinc-400 text-sm flex-1 mb-6 relative z-10">{p.manifest.description}</p>
              
              <div className="flex items-center gap-2 relative z-10 mt-auto">
                {!p.installed ? (
                  <button 
                    onClick={() => handleInstall(p.manifest.id)}
                    disabled={actionLoading === p.manifest.id}
                    className="flex-1 py-2 bg-white/10 hover:bg-white/20 rounded-xl text-sm transition-colors flex justify-center items-center gap-2 font-medium disabled:opacity-50"
                  >
                    {actionLoading === p.manifest.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <DownloadCloud className="w-4 h-4" />} Install
                  </button>
                ) : (
                  <>
                    <button 
                      className="flex-1 py-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 rounded-xl text-sm transition-colors flex justify-center items-center gap-2 font-medium"
                    >
                      <RefreshCw className="w-4 h-4" /> Update
                    </button>
                    <button 
                      onClick={() => handleUninstall(p.manifest.id)}
                      disabled={actionLoading === p.manifest.id}
                      className="py-2 px-4 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 rounded-xl text-sm transition-colors flex justify-center items-center disabled:opacity-50"
                    >
                      {actionLoading === p.manifest.id ? <Loader2 className="w-4 h-4 animate-spin"/> : <Trash2 className="w-4 h-4" />}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};
