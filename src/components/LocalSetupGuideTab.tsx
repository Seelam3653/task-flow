import React, { useState } from 'react';
import { 
  Laptop, Copy, Check, FileCode2, Play, Cpu
} from 'lucide-react';
import { completePubspecYaml, localExecutionSteps } from '../data/flutterLocalSetupData';
import { completeProductionMainDart } from '../data/flutterProductionMainDart';

export const LocalSetupGuideTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'walkthrough' | 'pubspec' | 'main_dart'>('walkthrough');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
              <Laptop className="w-3.5 h-3.5" />
              Local Developer Workflow
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Run TaskFlow on Your Local Machine</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Step-by-step instructions to create the Flutter project, install dependencies, test on your Android device with hot-reload, and build the release <code className="bg-slate-800 px-1 py-0.5 rounded text-blue-300 font-mono">.aab</code>.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-200">Prerequisite: Flutter SDK &ge; 3.24</span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveSubtab('walkthrough')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'walkthrough'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Play className="w-4 h-4" />
          Terminal Walkthrough (6 Steps)
        </button>
        <button
          onClick={() => setActiveSubtab('pubspec')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'pubspec'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          Complete `pubspec.yaml`
        </button>
        <button
          onClick={() => setActiveSubtab('main_dart')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'main_dart'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          Starter `lib/main.dart`
        </button>
      </div>

      {/* SUBTAB 1: WALKTHROUGH */}
      {activeSubtab === 'walkthrough' && (
        <div className="space-y-4">
          {localExecutionSteps.map((stepItem) => (
            <div key={stepItem.step} className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-blue-100 text-blue-800 flex items-center justify-center font-bold text-xs">
                    {stepItem.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">{stepItem.title}</h3>
                    <p className="text-xs text-slate-500">{stepItem.desc}</p>
                  </div>
                </div>
                <button
                  onClick={() => copyToClipboard(stepItem.command, `step-${stepItem.step}`)}
                  className="px-2.5 py-1 text-xs text-blue-700 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 rounded-md font-semibold flex items-center gap-1 transition-colors"
                >
                  {copiedKey === `step-${stepItem.step}` ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700 font-bold">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy Command</span>
                    </>
                  )}
                </button>
              </div>

              {/* Command box */}
              <pre className="p-3 bg-slate-950 text-emerald-400 font-mono text-xs rounded-lg overflow-x-auto border border-slate-800">
                <code>{stepItem.command}</code>
              </pre>

              {/* Note */}
              <div className="flex items-center gap-2 text-[11px] text-slate-500 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                <span className="font-semibold text-slate-700">Tip:</span>
                <span>{stepItem.note}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SUBTAB 2: PUBSPEC.YAML */}
      {activeSubtab === 'pubspec' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Full Production `pubspec.yaml`
              </h3>
              <p className="text-[11px] text-slate-500">
                Save this to your project's root folder (<code className="text-blue-700">taskflow/pubspec.yaml</code>).
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(completePubspecYaml, 'pubspec')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedKey === 'pubspec' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'pubspec' ? 'Copied' : 'Copy File Content'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[500px]">
            <code>{completePubspecYaml}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 3: MAIN.DART */}
      {activeSubtab === 'main_dart' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                Production Entry Point `lib/main.dart`
              </h3>
              <p className="text-[11px] text-slate-500">
                Replace your default <code className="text-blue-700">lib/main.dart</code> with this starter file.
              </p>
            </div>
            <button
              onClick={() => copyToClipboard(completeProductionMainDart, 'main_dart')}
              className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
            >
              {copiedKey === 'main_dart' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedKey === 'main_dart' ? 'Copied' : 'Copy File Content'}</span>
            </button>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[500px]">
            <code>{completeProductionMainDart}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
