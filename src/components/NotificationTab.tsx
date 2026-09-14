import React, { useState } from 'react';
import { 
  Bell, Clock, ShieldCheck, AlertCircle, Smartphone, CheckCircle2, 
  Settings, Volume2, Calendar, Zap, Layers, FileCode2, Play, Flame
} from 'lucide-react';
import { notificationServiceDartCode, workmanagerDartCode } from '../data/flutterNotificationDartCode';

interface ScheduledAlarm {
  id: number;
  title: string;
  category: 'task' | 'habit' | 'pomodoro';
  scheduledTime: string;
  channel: string;
  isExact: boolean;
  active: boolean;
}

export const NotificationTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'alarms' | 'service_code' | 'workmanager' | 'permissions'>('alarms');

  // Permission toggles simulation
  const [postNotificationsGranted, setPostNotificationsGranted] = useState<boolean>(true);
  const [exactAlarmGranted, setExactAlarmGranted] = useState<boolean>(true);
  const [batteryOptimizationIgnored, setBatteryOptimizationIgnored] = useState<boolean>(true);

  // Active scheduled alerts
  const [alarms, setAlarms] = useState<ScheduledAlarm[]>([
    {
      id: 1,
      title: 'Due in 15m: Series A Pitch Deck Financials',
      category: 'task',
      scheduledTime: 'Today at 05:45 PM',
      channel: 'Task Reminders (High Priority)',
      isExact: true,
      active: true,
    },
    {
      id: 2,
      title: 'Habit Nudge: Drink 2.5L Water',
      category: 'habit',
      scheduledTime: 'Daily at 08:00 PM',
      channel: 'Habit Daily Nudges',
      isExact: false,
      active: true,
    },
    {
      id: 3,
      title: 'Habit Nudge: Evening Brain Dump & Plan Tomorrow',
      category: 'habit',
      scheduledTime: 'Daily at 09:30 PM',
      channel: 'Habit Daily Nudges',
      isExact: false,
      active: true,
    },
    {
      id: 4,
      title: 'Focus Sprint Over: Take 5m Stretch Break',
      category: 'pomodoro',
      scheduledTime: 'In 23 mins',
      channel: 'Focus Session Alarms',
      isExact: true,
      active: true,
    },
  ]);

  // Push notification banner simulation
  const [activeBanner, setActiveBanner] = useState<ScheduledAlarm | null>(null);

  const triggerTestNotification = (alarm: ScheduledAlarm) => {
    setActiveBanner(alarm);
    setTimeout(() => {
      setActiveBanner(null);
    }, 4500);
  };

  const toggleAlarm = (id: number) => {
    setAlarms(alarms.map(a => a.id === id ? { ...a, active: !a.active } : a));
  };

  return (
    <div className="space-y-6">
      {/* Simulation Banner when test notification fires */}
      {activeBanner && (
        <div className="fixed top-4 right-4 z-50 max-w-sm w-full bg-slate-900/95 text-white p-4 rounded-2xl shadow-2xl border border-slate-700 animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-xl bg-indigo-600 text-white flex-shrink-0">
              <Bell className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400">TaskFlow Mobile Alert</span>
                <span className="text-[10px] text-slate-400">Now</span>
              </div>
              <p className="text-xs font-bold text-white mt-0.5 truncate">{activeBanner.title}</p>
              <p className="text-[11px] text-slate-300 mt-1">Channel: {activeBanner.channel}</p>
            </div>
          </div>
        </div>
      )}

      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-950 to-slate-900 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
              <Bell className="w-3.5 h-3.5" />
              Phase 7: Push Notifications, Alarms & Background Workers
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Android 14+ Exact Alarms & WorkManager Scheduling</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Doze-mode bypass with <code className="text-blue-300">exactAllowWhileIdle</code>, WorkManager 15-minute background sync, and notification channels.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <Smartphone className="w-4 h-4 text-blue-400" />
            <span className="text-slate-300 font-medium">Doze Bypass: Active</span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveSubtab('alarms')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'alarms'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Clock className="w-4 h-4" />
          Scheduled Reminders & Alarms
        </button>
        <button
          onClick={() => setActiveSubtab('permissions')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'permissions'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Android 14+ Permissions Matrix
        </button>
        <button
          onClick={() => setActiveSubtab('service_code')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'service_code'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          Flutter Service (`notification_service.dart`)
        </button>
        <button
          onClick={() => setActiveSubtab('workmanager')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'workmanager'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Zap className="w-4 h-4" />
          WorkManager Dispatcher
        </button>
      </div>

      {/* SUBTAB 1: SCHEDULED ALARMS */}
      {activeSubtab === 'alarms' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900">Active Time-Zone Aware Alarm Schedules</h3>
              <p className="text-xs text-slate-500">Scheduled using tz.TZDateTime to prevent drift during Daylight Savings transitions.</p>
            </div>
            <div className="text-xs font-mono text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg">
              Timezone: America/Los_Angeles (PST)
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {alarms.map((alarm) => (
              <div
                key={alarm.id}
                className={`p-4 rounded-xl border transition-all ${
                  alarm.active
                    ? 'bg-white border-slate-200 shadow-xs'
                    : 'bg-slate-50 border-slate-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div
                      className={`p-2.5 rounded-xl flex-shrink-0 ${
                        alarm.category === 'task'
                          ? 'bg-blue-50 text-blue-700'
                          : alarm.category === 'habit'
                          ? 'bg-amber-50 text-amber-700'
                          : 'bg-emerald-50 text-emerald-700'
                      }`}
                    >
                      {alarm.category === 'task' && <Calendar className="w-4 h-4" />}
                      {alarm.category === 'habit' && <Flame className="w-4 h-4" />}
                      {alarm.category === 'pomodoro' && <Clock className="w-4 h-4" />}
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{alarm.title}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">{alarm.scheduledTime}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <span className="text-[10px] px-2 py-0.5 rounded-md bg-slate-100 text-slate-700 font-mono">
                          {alarm.channel}
                        </span>
                        {alarm.isExact && (
                          <span className="text-[10px] px-2 py-0.5 rounded-md bg-blue-50 text-blue-700 font-bold">
                            Exact Alarm
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-2">
                    <button
                      onClick={() => toggleAlarm(alarm.id)}
                      className={`w-9 h-5 rounded-full p-0.5 transition-colors ${
                        alarm.active ? 'bg-blue-600' : 'bg-slate-300'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 rounded-full bg-white transition-transform ${
                          alarm.active ? 'translate-x-4' : 'translate-x-0'
                        }`}
                      />
                    </button>
                    <button
                      onClick={() => triggerTestNotification(alarm)}
                      className="text-[11px] text-blue-600 hover:text-blue-800 font-bold flex items-center gap-1"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      Test
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUBTAB 2: PERMISSIONS MATRIX */}
      {activeSubtab === 'permissions' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">POST_NOTIFICATIONS</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                Android 13+
              </span>
            </div>
            <p className="text-slate-600">
              Mandatory runtime permission prompt introduced in API level 33. Without this, notifications are suppressed by the OS.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-500">Status: Granted</span>
              <button
                onClick={() => setPostNotificationsGranted(!postNotificationsGranted)}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  postNotificationsGranted ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {postNotificationsGranted ? 'Revoke' : 'Grant'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">SCHEDULE_EXACT_ALARM</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 font-bold">
                Android 14+
              </span>
            </div>
            <p className="text-slate-600">
              Requires user authorization in system settings. Used for precise minute-level task deadlines and Pomodoro alarms.
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-500">Status: Authorized</span>
              <button
                onClick={() => setExactAlarmGranted(!exactAlarmGranted)}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  exactAlarmGranted ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {exactAlarmGranted ? 'Revoke' : 'Grant'}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-slate-900 text-sm">Battery Optimization</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 font-bold">
                Doze Bypass
              </span>
            </div>
            <p className="text-slate-600">
              Ensures alarms ring even when the phone has been stationary with screen off for multiple hours (Doze mode).
            </p>
            <div className="flex items-center justify-between pt-2 border-t border-slate-100">
              <span className="text-slate-500">Exemption: Active</span>
              <button
                onClick={() => setBatteryOptimizationIgnored(!batteryOptimizationIgnored)}
                className={`px-3 py-1 rounded-lg font-bold text-xs ${
                  batteryOptimizationIgnored ? 'bg-emerald-100 text-emerald-800' : 'bg-rose-100 text-rose-800'
                }`}
              >
                {batteryOptimizationIgnored ? 'Revoke' : 'Grant'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: NOTIFICATION SERVICE CODE */}
      {activeSubtab === 'service_code' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-blue-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4" />
              lib/core/notifications/notification_service.dart
            </span>
            <span className="text-slate-500">flutter_local_notifications Engine</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{notificationServiceDartCode}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 4: WORKMANAGER CODE */}
      {activeSubtab === 'workmanager' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-blue-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4" />
              lib/core/background/background_work_scheduler.dart
            </span>
            <span className="text-slate-500">Periodic 15-Minute WorkManager Dispatcher</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{workmanagerDartCode}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
