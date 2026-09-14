import React, { useState } from 'react';
import { 
  GitBranch, CheckCircle2, Play, Terminal, ShieldCheck, 
  Smartphone, Apple, Cpu, FileCode2, Layers, RefreshCw, UploadCloud, Clock
} from 'lucide-react';
import { 
  githubActionsCiWorkflowYaml, 
  fastlaneAndroidFastfile, 
  fastlaneIosFastfile 
} from '../data/flutterCicdCode';

interface PipelineStep {
  name: string;
  stage: 'quality' | 'android' | 'ios';
  status: 'passed' | 'running' | 'waiting';
  duration: string;
}

export const CicdDeploymentTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'pipeline' | 'github_workflow' | 'fastlane_android' | 'fastlane_ios'>('pipeline');
  const [isRunningPipeline, setIsRunningPipeline] = useState<boolean>(false);
  const [pipelineRunId, setPipelineRunId] = useState<number>(342);

  const [steps, setSteps] = useState<PipelineStep[]>([
    { name: 'Dart Code Formatter (dart format)', stage: 'quality', status: 'passed', duration: '12s' },
    { name: 'Flutter Analyze & Lint (--fatal-warnings)', stage: 'quality', status: 'passed', duration: '28s' },
    { name: 'Unit & Drift SQLite Schema Tests', stage: 'quality', status: 'passed', duration: '44s' },
    { name: 'Decode Android Keystore & Sign AAB', stage: 'android', status: 'passed', duration: '1m 15s' },
    { name: 'Fastlane Upload to Google Play Internal', stage: 'android', status: 'passed', duration: '48s' },
    { name: 'Match Certificate Sync & Build IPA', stage: 'ios', status: 'passed', duration: '2m 10s' },
    { name: 'Fastlane Deliver to Apple TestFlight', stage: 'ios', status: 'passed', duration: '1m 05s' },
  ]);

  const handleTriggerPipeline = () => {
    setIsRunningPipeline(true);
    setPipelineRunId(prev => prev + 1);

    // Set all to running
    setSteps(prev => prev.map(s => ({ ...s, status: 'running' })));

    setTimeout(() => {
      setSteps(prev => prev.map(s => ({ ...s, status: 'passed' })));
      setIsRunningPipeline(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-950 via-slate-900 to-emerald-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-teal-500/20 text-teal-300 text-xs font-semibold mb-2">
              <GitBranch className="w-3.5 h-3.5" />
              Phase 10: CI/CD Pipeline, Fastlane & Store Deployment
            </div>
            <h2 className="text-2xl font-bold tracking-tight">GitHub Actions & Fastlane Automated Release Engine</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Automated Flutter quality gates, Android App Bundle (AAB) deployment to Google Play Internal track,
              and macOS runner signing for Apple TestFlight.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span className="font-semibold text-slate-200">Quality Gate: 100% Passing</span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveSubtab('pipeline')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'pipeline'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Play className="w-4 h-4" />
          Live CI/CD Pipeline Simulator
        </button>
        <button
          onClick={() => setActiveSubtab('github_workflow')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'github_workflow'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          GitHub Actions (`deploy.yml`)
        </button>
        <button
          onClick={() => setActiveSubtab('fastlane_android')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'fastlane_android'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          Android Fastlane (`Fastfile`)
        </button>
        <button
          onClick={() => setActiveSubtab('fastlane_ios')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'fastlane_ios'
              ? 'border-teal-600 text-teal-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Apple className="w-4 h-4" />
          iOS TestFlight Fastlane (`Fastfile`)
        </button>
      </div>

      {/* SUBTAB 1: PIPELINE RUNNER */}
      {activeSubtab === 'pipeline' && (
        <div className="space-y-6">
          {/* Controls Bar */}
          <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-teal-50 text-teal-700">
                <GitBranch className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-xs font-bold text-slate-900">Branch: refs/heads/main (Run #{pipelineRunId})</h3>
                <p className="text-[11px] text-slate-500">Trigger: Push to production branch</p>
              </div>
            </div>

            <button
              onClick={handleTriggerPipeline}
              disabled={isRunningPipeline}
              className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
            >
              {isRunningPipeline ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isRunningPipeline ? 'Executing Steps...' : 'Re-Run Entire Pipeline'}</span>
            </button>
          </div>

          {/* Pipeline Stage Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Stage 1: Quality Gate */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-teal-600" />
                  <h4 className="text-xs font-bold text-slate-900">1. Quality Gates & Tests</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  ubuntu-latest
                </span>
              </div>

              <div className="space-y-3">
                {steps.filter(s => s.stage === 'quality').map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      {step.status === 'passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-teal-600 animate-spin flex-shrink-0" />
                      )}
                      <span className="truncate text-slate-700 font-medium">{step.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">{step.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage 2: Android Play Store */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-emerald-600" />
                  <h4 className="text-xs font-bold text-slate-900">2. Google Play Internal</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                  Fastlane Android
                </span>
              </div>

              <div className="space-y-3">
                {steps.filter(s => s.stage === 'android').map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      {step.status === 'passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-teal-600 animate-spin flex-shrink-0" />
                      )}
                      <span className="truncate text-slate-700 font-medium">{step.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">{step.duration}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stage 3: iOS TestFlight */}
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <Apple className="w-4 h-4 text-slate-900" />
                  <h4 className="text-xs font-bold text-slate-900">3. Apple TestFlight</h4>
                </div>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-800 font-bold">
                  macos-14 M2
                </span>
              </div>

              <div className="space-y-3">
                {steps.filter(s => s.stage === 'ios').map((step, idx) => (
                  <div key={idx} className="flex items-center justify-between text-xs p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                    <div className="flex items-center gap-2 min-w-0">
                      {step.status === 'passed' ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      ) : (
                        <RefreshCw className="w-4 h-4 text-teal-600 animate-spin flex-shrink-0" />
                      )}
                      <span className="truncate text-slate-700 font-medium">{step.name}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-mono ml-2">{step.duration}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: GITHUB WORKFLOW YAML */}
      {activeSubtab === 'github_workflow' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-teal-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4" />
              .github/workflows/deploy.yml
            </span>
            <span className="text-slate-500">Automated Multi-Platform Build Spec</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{githubActionsCiWorkflowYaml}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 3: ANDROID FASTFILE */}
      {activeSubtab === 'fastlane_android' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-teal-400 flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              android/fastlane/Fastfile
            </span>
            <span className="text-slate-500">Google Play AAB Automation</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{fastlaneAndroidFastfile}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 4: IOS FASTFILE */}
      {activeSubtab === 'fastlane_ios' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-teal-400 flex items-center gap-2">
              <Apple className="w-4 h-4" />
              ios/fastlane/Fastfile
            </span>
            <span className="text-slate-500">TestFlight & Match Certificate Automation</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{fastlaneIosFastfile}</code>
          </pre>
        </div>
      )}
    </div>
  );
};
