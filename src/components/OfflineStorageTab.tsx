import React, { useState } from 'react';
import { 
  Database, RefreshCw, Wifi, WifiOff, ArrowRightLeft, ShieldCheck, 
  AlertTriangle, CheckCircle2, Clock, Layers, FileCode2, ArrowDownUp, Check
} from 'lucide-react';
import { driftDatabaseDartCode, conflictResolutionDartCode } from '../data/flutterDriftDartCode';

interface SyncQueueItem {
  id: number;
  entityType: string;
  entityId: string;
  mutationType: 'INSERT' | 'UPDATE' | 'DELETE';
  payloadSummary: string;
  timestamp: string;
  retryCount: number;
}

export const OfflineStorageTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'simulation' | 'drift_schema' | 'conflict_code' | 'architecture'>('simulation');

  // Network & Sync Simulation State
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [lastSyncTime, setLastSyncTime] = useState<string>('Just now');
  
  // Conflicting Records Demo
  const [conflictResolved, setConflictResolved] = useState<boolean>(false);
  const [resolvedRecord, setResolvedRecord] = useState<string | null>(null);

  // Sync Mutation Queue
  const [syncQueue, setSyncQueue] = useState<SyncQueueItem[]>([
    {
      id: 101,
      entityType: 'task',
      entityId: 't-942',
      mutationType: 'UPDATE',
      payloadSummary: 'title: "Revise pitch deck for Series A", status: "completed"',
      timestamp: '2 mins ago',
      retryCount: 0,
    },
    {
      id: 102,
      entityType: 'habit',
      entityId: 'h-1',
      mutationType: 'INSERT',
      payloadSummary: 'title: "Drink 2.5L Water", log_date: "2026-09-14"',
      timestamp: '5 mins ago',
      retryCount: 0,
    },
    {
      id: 103,
      entityType: 'task',
      entityId: 't-318',
      mutationType: 'DELETE',
      payloadSummary: 'Soft delete: deleted_at: "2026-09-14T10:15:00Z"',
      timestamp: '12 mins ago',
      retryCount: 0,
    },
  ]);

  // Local vs Remote conflict state
  const [localTask, setLocalTask] = useState({
    title: 'Audit Firebase security rules (Modified on iPhone while on Airplane mode)',
    priority: 'urgent',
    updatedAt: '2026-09-14T10:45:00Z',
    device: 'iOS Client (Offline)',
  });

  const [remoteTask, setRemoteTask] = useState({
    title: 'Audit Firebase security rules (Updated on Web dashboard)',
    priority: 'high',
    updatedAt: '2026-09-14T10:30:00Z',
    device: 'Cloud Database (Supabase)',
  });

  const handleManualSync = () => {
    if (!isOnline) return;
    setIsSyncing(true);
    setTimeout(() => {
      setIsSyncing(false);
      setSyncQueue([]);
      setLastSyncTime(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }));
    }, 1200);
  };

  const handleResolveConflict = (strategy: 'LWW' | 'localWins' | 'remoteWins') => {
    setConflictResolved(true);
    if (strategy === 'LWW') {
      // Local (10:45) is newer than Remote (10:30)
      setResolvedRecord(`Last-Write-Wins selected Local Version (10:45 AM > 10:30 AM): "${localTask.title}" with Priority "${localTask.priority}". Pushed to Supabase.`);
    } else if (strategy === 'remoteWins') {
      setResolvedRecord(`Remote-Wins selected Cloud Version: "${remoteTask.title}" with Priority "${remoteTask.priority}". Overwrote local storage.`);
    } else {
      setResolvedRecord(`Local-Wins retained Device Version: "${localTask.title}". Pushed to Supabase.`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
              <Database className="w-3.5 h-3.5" />
              Phase 6: Offline-First Storage & Conflict Resolution
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Drift SQLite, Mutation Queues & Sync Engine</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Zero-latency local database operations, durable background mutation queues, and automatic Last-Write-Wins (LWW) conflict resolution with Supabase.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <span className={`w-2.5 h-2.5 rounded-full ${isOnline ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="font-semibold text-slate-200">{isOnline ? 'Online (Connected)' : 'Offline (Local Cache)'}</span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveSubtab('simulation')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'simulation'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ArrowRightLeft className="w-4 h-4" />
          Sync & Conflict Simulation
        </button>
        <button
          onClick={() => setActiveSubtab('drift_schema')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'drift_schema'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Database className="w-4 h-4" />
          Drift Schema (`app_database.dart`)
        </button>
        <button
          onClick={() => setActiveSubtab('conflict_code')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'conflict_code'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          Conflict Resolver Engine
        </button>
        <button
          onClick={() => setActiveSubtab('architecture')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'architecture'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Sync Architecture Spec
        </button>
      </div>

      {/* SUBTAB 1: SIMULATION */}
      {activeSubtab === 'simulation' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setIsOnline(!isOnline)}
                className={`px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-2 transition-colors ${
                  isOnline
                    ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                    : 'bg-rose-100 text-rose-800 hover:bg-rose-200'
                }`}
              >
                {isOnline ? <Wifi className="w-4 h-4" /> : <WifiOff className="w-4 h-4" />}
                {isOnline ? 'Device Status: Online' : 'Device Status: Offline (Simulate Airplane)'}
              </button>

              <div className="text-xs text-slate-500">
                Last synced: <span className="font-semibold text-slate-800">{lastSyncTime}</span>
              </div>
            </div>

            <button
              onClick={handleManualSync}
              disabled={!isOnline || isSyncing}
              className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors shadow-xs"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Flushing Mutations...' : 'Trigger Sync Now'}
            </button>
          </div>

          {/* Mutation Queue Table */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900">Drift Local Mutation Queue (`sync_mutation_queue`)</h3>
                <p className="text-xs text-slate-500">Unsynced offline transactions waiting to be flushed to Supabase.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
                {syncQueue.length} Pending
              </span>
            </div>

            {syncQueue.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500 space-y-2">
                <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto" />
                <p className="font-bold text-slate-800 text-sm">All local mutations synchronized!</p>
                <p>Local SQLite cache and Supabase PostgreSQL tables are in parity.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 bg-slate-50/50 text-slate-600">
                      <th className="p-3 font-bold">Type</th>
                      <th className="p-3 font-bold">Entity</th>
                      <th className="p-3 font-bold">Payload Summary</th>
                      <th className="p-3 font-bold">Time</th>
                      <th className="p-3 font-bold">Retries</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {syncQueue.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/50">
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${
                              item.mutationType === 'INSERT'
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.mutationType === 'UPDATE'
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.mutationType}
                          </span>
                        </td>
                        <td className="p-3 font-mono text-slate-700">{item.entityType}:{item.entityId}</td>
                        <td className="p-3 text-slate-800 font-mono text-[11px] truncate max-w-xs">{item.payloadSummary}</td>
                        <td className="p-3 text-slate-500">{item.timestamp}</td>
                        <td className="p-3 font-mono text-slate-600">{item.retryCount}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Interactive Conflict Demo */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-amber-500" />
              <div>
                <h4 className="text-sm font-bold text-slate-900">Concurrent Conflict Resolution Engine</h4>
                <p className="text-xs text-slate-500">Simulate what happens when the same task is modified concurrently offline and in the cloud.</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Device 1 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{localTask.device}</span>
                  <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-mono text-[10px]">10:45 AM</span>
                </div>
                <div className="text-slate-700 font-medium">"{localTask.title}"</div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Priority:</span>
                  <span className="font-bold text-rose-600 uppercase">{localTask.priority}</span>
                </div>
              </div>

              {/* Device 2 */}
              <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800">{remoteTask.device}</span>
                  <span className="px-2 py-0.5 rounded-md bg-slate-200 text-slate-700 font-mono text-[10px]">10:30 AM</span>
                </div>
                <div className="text-slate-700 font-medium">"{remoteTask.title}"</div>
                <div className="flex items-center gap-2">
                  <span className="text-slate-400">Priority:</span>
                  <span className="font-bold text-amber-600 uppercase">{remoteTask.priority}</span>
                </div>
              </div>
            </div>

            {/* Strategy Buttons */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <span className="text-xs font-bold text-slate-700">Choose Strategy:</span>
              <button
                onClick={() => handleResolveConflict('LWW')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition-colors shadow-xs"
              >
                Apply Last-Write-Wins (LWW) [Recommended]
              </button>
              <button
                onClick={() => handleResolveConflict('remoteWins')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                Remote Wins
              </button>
              <button
                onClick={() => handleResolveConflict('localWins')}
                className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-colors"
              >
                Local Wins
              </button>
            </div>

            {conflictResolved && resolvedRecord && (
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium flex items-start gap-2">
                <Check className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span>{resolvedRecord}</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 2: DRIFT DART SCHEMA */}
      {activeSubtab === 'drift_schema' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4" />
              lib/core/database/app_database.dart
            </span>
            <span className="text-slate-500">Drift SQLite Schema & Mutation Queue Tables</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{driftDatabaseDartCode}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 3: CONFLICT CODE */}
      {activeSubtab === 'conflict_code' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-emerald-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4" />
              lib/core/sync/sync_conflict_resolver.dart
            </span>
            <span className="text-slate-500">Timestamp Comparator & Entity Merger</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{conflictResolutionDartCode}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 4: ARCHITECTURE SPEC */}
      {activeSubtab === 'architecture' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ArrowDownUp className="w-4 h-4 text-emerald-600" />
              1. Two-Way Sync Protocol
            </h4>
            <p className="text-slate-600 leading-relaxed">
              TaskFlow relies on a strict offline-first hierarchy:
            </p>
            <ol className="list-decimal pl-4 space-y-1.5 text-slate-700">
              <li><strong>UI Read/Write:</strong> The UI only interacts directly with local SQLite (Drift). State changes render with 0ms latency.</li>
              <li><strong>Append to Queue:</strong> Every mutation inserts an entry into <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800">sync_mutation_queue</code>.</li>
              <li><strong>Background Drainer:</strong> A periodic or connectivity-triggered worker reads batches of 50 mutations and sends them via HTTPS to Supabase RPC.</li>
              <li><strong>Soft Deletions:</strong> Deleted tasks are never wiped immediately; they receive a <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-800">deleted_at</code> timestamp to replicate tombstones across devices.</li>
            </ol>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              2. Exponential Backoff & Integrity
            </h4>
            <p className="text-slate-600 leading-relaxed">
              If a synchronization batch encounters an HTTP 500 or rate limit, mutations are not dropped:
            </p>
            <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1 font-mono text-[11px] text-slate-700">
              <div>Retry 1: Delay 1 second</div>
              <div>Retry 2: Delay 2 seconds</div>
              <div>Retry 3: Delay 4 seconds</div>
              <div>Retry 4: Delay 8 seconds (Max cap 30s)</div>
            </div>
            <p className="text-slate-500">
              Failed items increment their retry counter; if corruption occurs, the item is moved to an isolation table for user confirmation.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
