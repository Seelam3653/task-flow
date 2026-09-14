import React from 'react';
import { Layers, ShieldCheck, Zap, Sparkles, Database, Bell, Lock, Crown, GitBranch, Activity, Rocket, Smartphone } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Header: React.FC<HeaderProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'architecture', label: '1. Product Architecture', icon: Layers },
    { id: 'supabase', label: '2. Supabase & RLS (Phase 2)', icon: ShieldCheck },
    { id: 'core-tasks', label: '3. Core Tasks & Flutter (Phase 3)', icon: Layers },
    { id: 'habits-focus', label: '4. Habits & Pomodoro (Phase 4)', icon: Sparkles },
    { id: 'analytics-ai', label: '5. Analytics & AI (Phase 5)', icon: Zap },
    { id: 'offline-sync', label: '6. Offline Storage & Sync (Phase 6)', icon: Database },
    { id: 'notifications', label: '7. Notifications & Alarms (Phase 7)', icon: Bell },
    { id: 'auth-session', label: '8. Auth & Security (Phase 8)', icon: Lock },
    { id: 'subscriptions', label: '9. Subscriptions & IAP (Phase 9)', icon: Crown },
    { id: 'cicd', label: '10. CI/CD & Fastlane (Phase 10)', icon: GitBranch },
    { id: 'performance', label: '11. Performance & Profiling (Phase 11)', icon: Activity },
    { id: 'launch', label: '12. Launch & Store Telemetry (Phase 12)', icon: Rocket },
    { id: 'google-play', label: '🎯 Target 1: Google Play Launch Hub', icon: Smartphone },
    { id: 'database', label: '13. Database ER Design', icon: Layers },
    { id: 'monetization', label: '14. Monetization & Costs', icon: Zap },
    { id: 'design-system', label: '15. Material 3 Design', icon: Sparkles },
    { id: 'roadmap', label: '16. 12-Phase Roadmap', icon: Layers },
  ];

  return (
    <header className="border-b border-slate-200 bg-white sticky top-0 z-30 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold shadow-md shadow-indigo-200">
              TF
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-slate-900 leading-tight">
                  TaskFlow
                </h1>
                <span className="px-2 py-0.5 text-xs font-semibold uppercase tracking-wider bg-emerald-100 text-emerald-800 rounded-full">
                  Phase 1 Complete
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Production-Ready Smart Daily Task Manager • System Architecture
              </p>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Target Platform:</span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
              Flutter / Dart (Material 3)
            </span>
            <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200">
              Supabase (PostgreSQL + RLS)
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto no-scrollbar py-2 border-t border-slate-100">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                id={`tab-btn-${tab.id}`}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 py-2 text-xs sm:text-sm font-medium rounded-lg whitespace-nowrap transition-colors ${
                  isActive
                    ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-600' : 'text-slate-400'}`} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>
    </header>
  );
};
