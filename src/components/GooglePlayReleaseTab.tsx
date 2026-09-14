import React, { useState } from 'react';
import { 
  Smartphone, Copy, Check, ShieldCheck, AlertCircle, FileCode2, 
  ExternalLink, Key, Package, Sparkles, CheckCircle2, Terminal, Info, Users, Clock
} from 'lucide-react';
import { 
  googlePlayListingCopy, 
  googlePlayDataSafetyAnswers, 
  exactAlarmDeclarationText, 
  androidSigningGuide 
} from '../data/googlePlayReleaseData';

export const GooglePlayReleaseTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'listing' | 'data_safety' | 'policies' | 'signing' | 'closed_testing'>('listing');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // AAB Build simulator state
  const [isBuildingAab, setIsBuildingAab] = useState<boolean>(false);
  const [aabBuilt, setAabBuilt] = useState<boolean>(false);

  const copyToClipboard = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleSimulateBuildAab = () => {
    setIsBuildingAab(true);
    setAabBuilt(false);
    setTimeout(() => {
      setIsBuildingAab(false);
      setAabBuilt(true);
    }, 1800);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-emerald-950 via-slate-900 to-teal-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold mb-2">
              <Smartphone className="w-3.5 h-3.5" />
              Target 1: Google Play Store Release Command Center
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Google Play Launch & Console Readiness Hub</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Complete store listing copy, Data Safety form declarations, Android 14 exact alarm policy justification,
              keystore signing config, and the 20-tester closed testing roadmap.
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-semibold text-slate-200">Play Console Target: Android 14 (API 34)</span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium overflow-x-auto">
        <button
          onClick={() => setActiveSubtab('listing')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeSubtab === 'listing'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Smartphone className="w-4 h-4" />
          1. Store Listing Copy & Graphics
        </button>
        <button
          onClick={() => setActiveSubtab('data_safety')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeSubtab === 'data_safety'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          2. Data Safety Form Answers
        </button>
        <button
          onClick={() => setActiveSubtab('policies')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeSubtab === 'policies'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertCircle className="w-4 h-4" />
          3. Android 14 Exact Alarm Policy
        </button>
        <button
          onClick={() => setActiveSubtab('signing')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeSubtab === 'signing'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Key className="w-4 h-4" />
          4. Keystore & AAB Build
        </button>
        <button
          onClick={() => setActiveSubtab('closed_testing')}
          className={`px-4 py-2.5 border-b-2 whitespace-nowrap transition-colors flex items-center gap-2 ${
            activeSubtab === 'closed_testing'
              ? 'border-emerald-600 text-emerald-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Users className="w-4 h-4" />
          5. 20-Tester Closed Testing Guide
        </button>
      </div>

      {/* SUBTAB 1: STORE LISTING & GRAPHICS */}
      {activeSubtab === 'listing' && (
        <div className="space-y-6">
          {/* Metadata Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* App Name */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  App Name ({googlePlayListingCopy.appName.length}/30 characters)
                </span>
                <button
                  onClick={() => copyToClipboard(googlePlayListingCopy.appName, 'appName')}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                >
                  {copiedKey === 'appName' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'appName' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-sm font-bold text-slate-900 font-mono bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {googlePlayListingCopy.appName}
              </p>
            </div>

            {/* Short Description */}
            <div className="bg-white rounded-xl border border-slate-200 p-4 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Short Description ({googlePlayListingCopy.shortDescription.length}/80 characters)
                </span>
                <button
                  onClick={() => copyToClipboard(googlePlayListingCopy.shortDescription, 'shortDesc')}
                  className="text-xs text-emerald-700 hover:text-emerald-800 font-semibold flex items-center gap-1"
                >
                  {copiedKey === 'shortDesc' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey === 'shortDesc' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="text-xs font-medium text-slate-900 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {googlePlayListingCopy.shortDescription}
              </p>
            </div>
          </div>

          {/* Full Description Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Full Store Description (Formatted with Features, AI Details & Privacy)
                </h3>
                <p className="text-[11px] text-slate-500">Ready to paste directly into Google Play Console Main Store Listing.</p>
              </div>
              <button
                onClick={() => copyToClipboard(googlePlayListingCopy.fullDescription, 'fullDesc')}
                className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedKey === 'fullDesc' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'fullDesc' ? 'Copied Description' : 'Copy Full Text'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-sans text-slate-800 whitespace-pre-wrap leading-relaxed max-h-[360px] overflow-y-auto bg-white">
              {googlePlayListingCopy.fullDescription}
            </pre>
          </div>

          {/* Graphic Asset Specifications */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Google Play Required Graphic Specifications
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <Smartphone className="w-4 h-4" /> App Icon
                </span>
                <p className="text-slate-600 text-[11px]">
                  <strong>512 x 512 px</strong> PNG (up to 1MB). 32-bit color with alpha channel allowed.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4" /> Feature Graphic
                </span>
                <p className="text-slate-600 text-[11px]">
                  <strong>1024 x 500 px</strong> JPEG or 24-bit PNG (no alpha, up to 15MB). Highlights key brand tagline.
                </p>
              </div>
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <span className="font-bold text-emerald-800 flex items-center gap-1.5">
                  <Package className="w-4 h-4" /> Phone Screenshots
                </span>
                <p className="text-slate-600 text-[11px]">
                  At least <strong>2 to 8 screenshots</strong>, 16:9 or 9:16 aspect ratio (e.g., 1080 x 1920 or 1440 x 3120).
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: DATA SAFETY FORM ANSWERS */}
      {activeSubtab === 'data_safety' && (
        <div className="space-y-6">
          <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 flex items-start gap-3 text-xs text-emerald-900">
            <ShieldCheck className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-emerald-950">Google Play Data Safety Form Answers Guide</p>
              <p className="mt-0.5 text-emerald-800">
                Google Play requires exact disclosures of every data point collected or shared. Use the matrix below to answer the questionnaire in Google Play Console with 100% policy compliance.
              </p>
            </div>
          </div>

          {/* Data Safety Table */}
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 bg-slate-100/50 text-slate-600">
                    <th className="p-3.5 font-bold">Data Category</th>
                    <th className="p-3.5 font-bold">Specific Field</th>
                    <th className="p-3.5 font-bold">Collected?</th>
                    <th className="p-3.5 font-bold">Shared?</th>
                    <th className="p-3.5 font-bold">Stated Purpose in Play Console</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {googlePlayDataSafetyAnswers.map((group, gIdx) =>
                    group.dataTypes.map((dt, dIdx) => (
                      <tr key={`${gIdx}-${dIdx}`} className="hover:bg-slate-50/50">
                        {dIdx === 0 && (
                          <td
                            rowSpan={group.dataTypes.length}
                            className="p-3.5 font-bold text-slate-900 align-top bg-slate-50/30 border-r border-slate-100"
                          >
                            {group.category}
                          </td>
                        )}
                        <td className="p-3.5 font-medium text-slate-800">{dt.name}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                            Yes (Collected)
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-bold text-[10px]">
                            No (Not Shared)
                          </span>
                        </td>
                        <td className="p-3.5 text-slate-600 text-[11px] leading-relaxed">
                          {dt.purposes.join('; ')}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Security Practices Summary */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Security Practices Questionnaire Answers
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Data encrypted in transit?</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">YES (HTTPS/TLS)</span>
              </div>
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-200 flex items-center justify-between">
                <span className="font-semibold text-slate-700">Users can request data deletion?</span>
                <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">YES (In-app + Web URL)</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 3: ANDROID 14 EXACT ALARM DECLARATION */}
      {activeSubtab === 'policies' && (
        <div className="space-y-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 flex items-start gap-3 text-xs text-amber-900">
            <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-amber-950">Android 14 (API 34) USE_EXACT_ALARM Policy Mandate</p>
              <p className="mt-0.5 text-amber-800">
                Google Play will reject or ban updates requesting <code className="bg-amber-100 px-1 py-0.5 rounded">USE_EXACT_ALARM</code> unless your app qualifies under the <strong>Calendar or Reminder / Task Management</strong> core functionality exemption.
              </p>
            </div>
          </div>

          {/* Policy Text Box */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Declaration Text for Play Console (App Content &rarr; Exact Alarm)
                </h3>
                <p className="text-[11px] text-slate-500">Copy and paste this verbatim when prompted by Google Play Console review.</p>
              </div>
              <button
                onClick={() => copyToClipboard(exactAlarmDeclarationText, 'alarmText')}
                className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedKey === 'alarmText' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'alarmText' ? 'Copied' : 'Copy Declaration'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-sans text-slate-800 whitespace-pre-wrap leading-relaxed bg-white">
              {exactAlarmDeclarationText}
            </pre>
          </div>

          {/* AndroidManifest.xml configuration */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
              <span className="text-emerald-400 flex items-center gap-2">
                <FileCode2 className="w-4 h-4" />
                android/app/src/main/AndroidManifest.xml
              </span>
              <span className="text-slate-500">Android Permissions</span>
            </div>
            <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto">
              <code>{`<!-- Critical permissions for time-sensitive task alarms and offline sync -->
<uses-permission android:name="android.permission.INTERNET"/>
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE"/>
<uses-permission android:name="android.permission.POST_NOTIFICATIONS"/>
<uses-permission android:name="android.permission.RECEIVE_BOOT_COMPLETED"/>
<uses-permission android:name="android.permission.SCHEDULE_EXACT_ALARM"/>
<uses-permission android:name="android.permission.USE_EXACT_ALARM"/>
<uses-permission android:name="android.permission.VIBRATE"/>
<uses-permission android:name="android.permission.WAKE_LOCK"/>`}</code>
            </pre>
          </div>
        </div>
      )}

      {/* SUBTAB 4: KEYSTORE & SIGNING */}
      {activeSubtab === 'signing' && (
        <div className="space-y-6">
          {/* Step 1: Keystore Generation */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Step 1: Generate Release Keystore via Terminal
                </h3>
                <p className="text-[11px] text-slate-500">Run this once in your terminal to create your production signing key.</p>
              </div>
              <button
                onClick={() => copyToClipboard(androidSigningGuide.keytoolCommand, 'keytool')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedKey === 'keytool' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'keytool' ? 'Copied' : 'Copy Command'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono bg-slate-950 text-emerald-400 overflow-x-auto">
              <code>{androidSigningGuide.keytoolCommand}</code>
            </pre>
          </div>

          {/* Step 2: key.properties */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Step 2: Create <code className="text-emerald-700">android/key.properties</code> (Never commit to Git!)
                </h3>
                <p className="text-[11px] text-slate-500">Stores your keystore passwords locally.</p>
              </div>
              <button
                onClick={() => copyToClipboard(androidSigningGuide.keyProperties, 'keyProps')}
                className="px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-xs"
              >
                {copiedKey === 'keyProps' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedKey === 'keyProps' ? 'Copied' : 'Copy Template'}</span>
              </button>
            </div>
            <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto">
              <code>{androidSigningGuide.keyProperties}</code>
            </pre>
          </div>

          {/* Step 3: Build AAB */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h3 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  Step 3: Compile Release Android App Bundle (.aab)
                </h3>
                <p className="text-[11px] text-slate-500">
                  Outputs to <code className="bg-slate-100 px-1 py-0.5 rounded text-emerald-700 font-mono">build/app/outputs/bundle/release/app-release.aab</code>
                </p>
              </div>
              <button
                onClick={handleSimulateBuildAab}
                disabled={isBuildingAab}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center gap-2 transition-colors disabled:opacity-50 shadow-xs"
              >
                <Package className="w-4 h-4" />
                <span>{isBuildingAab ? 'Compiling ProGuard AAB...' : 'Simulate AAB Compilation'}</span>
              </button>
            </div>

            {aabBuilt && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center justify-between text-xs text-emerald-900">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  <span className="font-semibold">Successfully compiled app-release.aab (Size: 18.4 MB with R8 ProGuard shrinking enabled)</span>
                </div>
                <span className="font-mono text-[10px] text-emerald-700">Ready for Google Play upload</span>
              </div>
            )}
          </div>
        </div>
      )}

      {/* SUBTAB 5: 20-TESTER CLOSED TESTING STRATEGY */}
      {activeSubtab === 'closed_testing' && (
        <div className="space-y-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 flex items-start gap-3 text-xs text-blue-900">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-blue-950">Google Play 20-Tester Mandate (For Accounts Created After Nov 13, 2023)</p>
              <p className="mt-0.5 text-blue-800">
                Google requires all personal developer accounts to run a <strong>Closed Testing Track with at least 20 testers opted in continuously for 14 days</strong> before the "Apply for Production Access" button unlocks.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5 text-xs">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">1</span>
                Create Google Group
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Create a public or invite-only Google Group (e.g., <code className="bg-slate-100 px-1 py-0.5 rounded font-mono text-slate-800">taskflow-testers@googlegroups.com</code>). In Play Console under <em>Closed testing &rarr; Testers</em>, link this Google Group so anyone who joins is automatically eligible.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">2</span>
                14-Day Opt-In Requirement
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                Send testers your Web/Android opt-in link. All 20 testers must tap <strong>"Become a Tester"</strong> and keep the app installed for 14 continuous days. Testers should launch the app and log activity periodically.
              </p>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <span className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold text-xs">3</span>
                Apply for Production Access
              </div>
              <p className="text-slate-600 leading-relaxed text-[11px]">
                On Day 14, Play Console unlocks the questionnaire asking what feedback you collected from testers and how you resolved bugs. Answer clearly, and Google usually approves production release within 48–72 hours.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
