/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { Header } from './components/Header';
import { MobileSimulatorTab } from './components/MobileSimulatorTab';
import { LocalSetupGuideTab } from './components/LocalSetupGuideTab';
import { GooglePlayReleaseTab } from './components/GooglePlayReleaseTab';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('mobile-app');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* App Header & Navigation */}
      <Header activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'mobile-app' && <MobileSimulatorTab onNavigateToLocalSetup={() => setActiveTab('local-setup')} />}
        {activeTab === 'local-setup' && <LocalSetupGuideTab />}
        {activeTab === 'google-play' && <GooglePlayReleaseTab />}
      </main>

      {/* Clean Mobile App Footer */}
      <footer className="border-t border-slate-200 bg-white py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-2">
          <div>
            <span className="font-bold text-slate-800">TaskFlow Android App</span> • Production Flutter Codebase
          </div>
          <div className="flex items-center gap-4">
            <span className="text-emerald-700 font-medium">✓ Flutter Material 3</span>
            <span className="text-emerald-700 font-medium">✓ SharedPreferences Local Disk</span>
            <span className="text-emerald-700 font-medium">✓ Google Play Ready</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

