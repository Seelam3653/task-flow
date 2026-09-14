/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { ArchitectureTab } from './components/ArchitectureTab';
import { SupabaseTab } from './components/SupabaseTab';
import { CoreTaskTab } from './components/CoreTaskTab';
import { HabitFocusTab } from './components/HabitFocusTab';
import { SmartAnalyticsTab } from './components/SmartAnalyticsTab';
import { OfflineStorageTab } from './components/OfflineStorageTab';
import { NotificationTab } from './components/NotificationTab';
import { AuthTab } from './components/AuthTab';
import { SubscriptionTab } from './components/SubscriptionTab';
import { CicdDeploymentTab } from './components/CicdDeploymentTab';
import { PerformanceTab } from './components/PerformanceTab';
import { LaunchTab } from './components/LaunchTab';
import { GooglePlayReleaseTab } from './components/GooglePlayReleaseTab';
import { DatabaseTab } from './components/DatabaseTab';
import { MonetizationTab } from './components/MonetizationTab';
import { DesignSystemTab } from './components/DesignSystemTab';
import { RoadmapTab } from './components/RoadmapTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('architecture');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* App Header & Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'architecture' && <ArchitectureTab />}
        {activeTab === 'supabase' && <SupabaseTab />}
        {activeTab === 'core-tasks' && <CoreTaskTab />}
        {activeTab === 'habits-focus' && <HabitFocusTab />}
        {activeTab === 'analytics-ai' && <SmartAnalyticsTab />}
        {activeTab === 'offline-sync' && <OfflineStorageTab />}
        {activeTab === 'notifications' && <NotificationTab />}
        {activeTab === 'auth-session' && <AuthTab />}
        {activeTab === 'subscriptions' && <SubscriptionTab />}
        {activeTab === 'cicd' && <CicdDeploymentTab />}
        {activeTab === 'performance' && <PerformanceTab />}
        {activeTab === 'launch' && <LaunchTab />}
        {activeTab === 'google-play' && <GooglePlayReleaseTab />}
        {activeTab === 'database' && <DatabaseTab />}
        {activeTab === 'monetization' && <MonetizationTab />}
        {activeTab === 'design-system' && <DesignSystemTab />}
        {activeTab === 'roadmap' && <RoadmapTab />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <div>
            <span className="font-bold text-slate-800">TaskFlow – Smart Daily Task Manager</span> • Production Release Blueprint (Phase 1)
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-medium">✓ ARCHITECTURE.md</span>
            <span className="text-emerald-700 font-medium">✓ DATABASE.md</span>
            <span className="text-emerald-700 font-medium">✓ MONETIZATION.md</span>
            <span className="text-emerald-700 font-medium">✓ SECURITY.md</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

