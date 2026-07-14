import { useStore } from '../store/useStore';
import { User, Mail, Shield, Clock } from 'lucide-react';

export const Profile = () => {
  const { user } = useStore();

  return (
    <div className="flex flex-col h-full bg-black text-white p-8">
      <h1 className="text-3xl font-bold tracking-tight text-white/90 mb-8">Profile</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <div className="flex items-center gap-6 mb-8">
            <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-4xl font-bold">
              {user?.username?.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold">{user?.full_name || user?.username}</h2>
              <p className="text-zinc-400">{user?.email}</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
              <div className="flex items-center gap-3 text-zinc-300">
                <User className="w-5 h-5 text-blue-400" />
                <span>Username</span>
              </div>
              <span className="font-medium">{user?.username}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
              <div className="flex items-center gap-3 text-zinc-300">
                <Mail className="w-5 h-5 text-purple-400" />
                <span>Email</span>
              </div>
              <span className="font-medium">{user?.email}</span>
            </div>
            
            <div className="flex items-center justify-between p-4 bg-black/30 rounded-xl border border-white/5">
              <div className="flex items-center gap-3 text-zinc-300">
                <Shield className="w-5 h-5 text-emerald-400" />
                <span>Role</span>
              </div>
              <span className="font-medium">{user?.role_id === 1 ? 'Admin' : 'User'}</span>
            </div>
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
          <h3 className="text-xl font-bold mb-6">Security</h3>
          <p className="text-sm text-zinc-400 mb-6">Manage your account security and sessions.</p>
          
          <button className="w-full py-3 px-4 rounded-xl bg-white/5 hover:bg-white/10 text-white font-medium transition-colors mb-4 text-left flex items-center justify-between">
            Change Password
            <ArrowRight className="w-4 h-4 text-zinc-400" />
          </button>
          
          <button className="w-full py-3 px-4 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 font-medium transition-colors text-left">
            Revoke all sessions
          </button>
        </div>
      </div>
    </div>
  );
};

const ArrowRight = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);
