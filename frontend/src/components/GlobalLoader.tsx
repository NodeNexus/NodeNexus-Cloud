import { Loader2 } from 'lucide-react';

export const GlobalLoader = () => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center min-h-full w-full bg-zinc-950/50 backdrop-blur-sm z-50">
      <div className="bg-zinc-900 border border-white/10 p-6 rounded-3xl flex flex-col items-center shadow-2xl">
        <Loader2 className="w-10 h-10 text-emerald-500 animate-spin mb-4" />
        <div className="font-bold text-white tracking-wide">Loading Module...</div>
      </div>
    </div>
  );
};
