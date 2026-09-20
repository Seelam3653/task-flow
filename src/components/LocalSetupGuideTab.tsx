import React, { useState } from 'react';
import { 
  Laptop, Copy, Check, FileCode2, Play, Cpu, FolderTree, FileText
} from 'lucide-react';
import { completePubspecYaml, localExecutionSteps } from '../data/flutterLocalSetupData';
import { completeProductionMainDart } from '../data/flutterProductionMainDart';
import { cleanFlutterFiles } from '../data/flutterCleanStructure';

export const LocalSetupGuideTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'clean_tree' | 'walkthrough' | 'pubspec' | 'main_dart'>('clean_tree');
  const [selectedFilePath, setSelectedFilePath] = useState<string>(cleanFlutterFiles[1].path);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedFile = cleanFlutterFiles.find(f => f.path === selectedFilePath) || cleanFlutterFiles[1];

  return (
    <div className="space-y-6">
      {/* Banner */}
      <div className="bg-gradient-to-r from-blue-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-xs font-semibold mb-2">
              <FolderTree className="w-3.5 h-3.5" />
              Production Clean Architecture
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Clean Modular Flutter Project Structure</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Organized into standard Flutter layers: <code className="text-blue-300 font-mono">models/</code>, <code className="text-blue-300 font-mono">screens/</code>, <code className="text-blue-300 font-mono">services/</code>, and <code className="text-blue-300 font-mono">widgets/</code>.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <Cpu className="w-4 h-4 text-blue-400" />
            <span className="font-semibold text-slate-200">Flutter 3.24+ Ready</span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium overflow-x-auto">
        <button
          onClick={() => setActiveSubtab('clean_tree')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubtab === 'clean_tree'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FolderTree className="w-4 h-4" />
          Modular Files Explorer (Clean Setup)
        </button>
        <button
          onClick={() => setActiveSubtab('main_dart')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubtab === 'main_dart'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          Single-File `lib/main.dart`
        </button>
        <button
          onClick={() => setActiveSubtab('pubspec')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubtab === 'pubspec'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          `pubspec.yaml`
        </button>
        <button
          onClick={() => setActiveSubtab('walkthrough')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 whitespace-nowrap ${
            activeSubtab === 'walkthrough'
              ? 'border-blue-600 text-blue-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Play className="w-4 h-4" />
          Terminal Walkthrough (6 Steps)
        </button>
      </div>

      {/* SUBTAB 0: CLEAN MODULAR TREE EXPLORER */}
      {activeSubtab === 'clean_tree' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* File Directory Sidebar */}
            <div className="md:col-span-4 bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">Project Tree</span>
                <span className="text-[11px] text-slate-500 font-mono">taskflow/</span>
              </div>

              <div className="space-y-1">
                {cleanFlutterFiles.map((file) => {
                  const isSelected = file.path === selectedFilePath;
                  return (
                    <button
                      key={file.path}
                      onClick={() => setSelectedFilePath(file.path)}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-mono flex items-center justify-between transition-colors ${
                        isSelected 
                          ? 'bg-blue-50 text-blue-700 font-bold border border-blue-200' 
                          : 'text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <FileText className={`w-3.5 h-3.5 shrink-0 ${isSelected ? 'text-blue-600' : 'text-slate-400'}`} />
                        <span className="truncate">{file.path}</span>
                      </div>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded font-sans uppercase font-bold shrink-0 ${
                        file.category === 'model' ? 'bg-amber-100 text-amber-800' :
                        file.category === 'screen' ? 'bg-indigo-100 text-indigo-800' :
                        file.category === 'service' ? 'bg-emerald-100 text-emerald-800' :
                        file.category === 'widget' ? 'bg-purple-100 text-purple-800' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {file.category}
                      </span>
                    </button>
                  );
                })}
              </div>

              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500">
                💡 <span className="font-semibold text-slate-700">Tip:</span> You can either create these clean modular files or use the single-file <code className="text-blue-600 font-bold">main.dart</code> tab.
              </div>
            </div>

            {/* File Code Viewer */}
            <div className="md:col-span-8 bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden flex flex-col">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-900 font-mono">{selectedFile.path}</span>
                  </div>
                  <p className="text-[11px] text-slate-500 mt-0.5">{selectedFile.description}</p>
                </div>
                <button
                  onClick={() => copyToClipboard(selectedFile.code, selectedFile.path)}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {copiedKey === selectedFile.path ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === selectedFile.path ? 'Copied' : 'Copy File'}</span>
                </button>
              </div>
              <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[520px] flex-1">
                <code>{selectedFile.code}</code>
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 1: WALKTHROUGH */}
      {activeSubtab === 'walkthrough' && (
        <div className="space-y-4">
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-950 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
            <div>
              <div className="font-bold text-sm text-blue-900 flex items-center gap-1.5">
                <span>⚡ Production Modular Architecture Walkthrough</span>
              </div>
              <p className="text-xs text-blue-700 mt-0.5">
                Follow these commands to build and run the offline-first TaskFlow app with <code>shared_preferences ^2.5.5</code>.
              </p>
            </div>
            <div className="text-xs bg-white/80 px-3 py-1.5 rounded-lg border border-blue-200 font-mono text-blue-800 font-semibold shrink-0">
              Target ID: com.taskflow.app
            </div>
          </div>

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
