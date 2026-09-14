import React, { useState } from 'react';
import { 
  Lock, KeyRound, Smartphone, ShieldCheck, Mail, LogIn, LogOut, 
  Fingerprint, CheckCircle2, User, RefreshCw, FileCode2, Layers, AlertTriangle
} from 'lucide-react';
import { authRepositoryDartCode, authStateNotifierDartCode } from '../data/flutterAuthDartCode';

export const AuthTab: React.FC = () => {
  const [activeSubtab, setActiveSubtab] = useState<'flow' | 'repo_code' | 'riverpod_code' | 'security_spec'>('flow');

  // Simulated Auth State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [authProvider, setAuthProvider] = useState<'google' | 'apple' | 'email'>('google');
  const [currentUser, setCurrentUser] = useState({
    id: 'usr_8492048-0284',
    email: 'manosai2002@gmail.com',
    displayName: 'Mano Sai',
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80',
    role: 'authenticated',
    plan: 'Pro Lifetime Member',
    biometricEnrolled: true,
  });

  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [biometricUnlocked, setBiometricUnlocked] = useState<boolean>(false);

  // Email form state
  const [emailInput, setEmailInput] = useState<string>('manosai2002@gmail.com');
  const [passwordInput, setPasswordInput] = useState<string>('••••••••••••');

  const handleSimulateLogin = (provider: 'google' | 'apple' | 'email') => {
    setIsLoggingIn(true);
    setTimeout(() => {
      setIsLoggingIn(false);
      setIsAuthenticated(true);
      setAuthProvider(provider);
    }, 900);
  };

  const handleSimulateLogout = () => {
    setIsAuthenticated(false);
  };

  const handleTriggerBiometric = () => {
    setBiometricUnlocked(true);
    setTimeout(() => {
      setBiometricUnlocked(false);
    }, 3500);
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-cyan-950 via-slate-900 to-indigo-950 rounded-2xl p-6 text-white shadow-lg">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 text-xs font-semibold mb-2">
              <Lock className="w-3.5 h-3.5" />
              Phase 8: Authentication, Social Login & Session Management
            </div>
            <h2 className="text-2xl font-bold tracking-tight">Supabase Auth, Google OAuth & Sign in with Apple</h2>
            <p className="text-sm text-slate-300 mt-1 max-w-2xl">
              Cross-platform OAuth 2.0 PKCE token exchange, Android Keystore & iOS Keychain encryption, 
              and Local Biometric Authentication (FaceID/Fingerprint).
            </p>
          </div>
          <div className="flex items-center gap-2 bg-slate-800/80 px-4 py-2 rounded-xl border border-slate-700 text-xs">
            <span className={`w-2 h-2 rounded-full ${isAuthenticated ? 'bg-emerald-400 animate-pulse' : 'bg-rose-500'}`}></span>
            <span className="font-semibold text-slate-200">
              {isAuthenticated ? `Signed in (${authProvider.toUpperCase()})` : 'Unauthenticated'}
            </span>
          </div>
        </div>
      </div>

      {/* Subtab Navigation */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-2 gap-2 text-sm font-medium">
        <button
          onClick={() => setActiveSubtab('flow')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'flow'
              ? 'border-cyan-600 text-cyan-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <LogIn className="w-4 h-4" />
          Interactive Auth & Session Manager
        </button>
        <button
          onClick={() => setActiveSubtab('riverpod_code')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'riverpod_code'
              ? 'border-cyan-600 text-cyan-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <Layers className="w-4 h-4" />
          Riverpod State (`auth_notifier.dart`)
        </button>
        <button
          onClick={() => setActiveSubtab('repo_code')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'repo_code'
              ? 'border-cyan-600 text-cyan-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <FileCode2 className="w-4 h-4" />
          Repository (`auth_repository_impl.dart`)
        </button>
        <button
          onClick={() => setActiveSubtab('security_spec')}
          className={`px-4 py-2.5 border-b-2 transition-colors flex items-center gap-2 ${
            activeSubtab === 'security_spec'
              ? 'border-cyan-600 text-cyan-700 font-bold'
              : 'border-transparent text-slate-600 hover:text-slate-900'
          }`}
        >
          <ShieldCheck className="w-4 h-4" />
          Token Storage & Security Spec
        </button>
      </div>

      {/* SUBTAB 1: INTERACTIVE AUTH FLOW */}
      {activeSubtab === 'flow' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Card 1: Auth Session State */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <User className="w-4 h-4 text-cyan-600" />
                Active Supabase Session
              </h3>
              <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-bold">
                JWT Valid (3600s TTL)
              </span>
            </div>

            {isAuthenticated ? (
              <div className="space-y-4">
                <div className="flex items-center gap-4 p-4 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="w-12 h-12 rounded-full bg-cyan-600 text-white flex items-center justify-center font-bold text-lg">
                    {currentUser.displayName.charAt(0)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 text-sm truncate">{currentUser.displayName}</h4>
                    <p className="text-xs text-slate-500 truncate">{currentUser.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 font-bold">
                        {currentUser.plan}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono">ID: {currentUser.id}</span>
                    </div>
                  </div>
                </div>

                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500">Authentication Method:</span>
                    <span className="font-bold text-slate-800 capitalize">Native {authProvider} OAuth</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">PostgreSQL RLS Role:</span>
                    <span className="font-mono text-cyan-700 font-bold">authenticated (user_id match)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500">Keychain Encryption:</span>
                    <span className="font-mono text-emerald-700 font-bold">AES-256 GCM (EncryptedSharedPreferences)</span>
                  </div>
                </div>

                {/* Biometrics Simulation */}
                <div className="pt-2 border-t border-slate-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Fingerprint className="w-5 h-5 text-indigo-600" />
                    <div>
                      <div className="text-xs font-bold text-slate-900">Biometric App Lock</div>
                      <div className="text-[11px] text-slate-500">Require FaceID / Fingerprint on cold start</div>
                    </div>
                  </div>
                  <button
                    onClick={handleTriggerBiometric}
                    className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors"
                  >
                    <Fingerprint className="w-3.5 h-3.5" />
                    Simulate Unlock
                  </button>
                </div>

                {biometricUnlocked && (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-900 font-medium flex items-center gap-2 animate-in fade-in">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Biometric credentials verified against platform Keystore. App unlocked!</span>
                  </div>
                )}

                <button
                  onClick={handleSimulateLogout}
                  className="w-full py-2.5 bg-slate-100 hover:bg-rose-50 hover:text-rose-700 text-slate-700 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors"
                >
                  <LogOut className="w-4 h-4" />
                  Sign Out of All Devices
                </button>
              </div>
            ) : (
              <div className="p-6 text-center space-y-3">
                <AlertTriangle className="w-8 h-8 text-amber-500 mx-auto" />
                <p className="text-xs text-slate-600">No active session found. Please sign in to test.</p>
                <button
                  onClick={() => handleSimulateLogin('google')}
                  className="px-4 py-2 bg-cyan-600 text-white rounded-lg text-xs font-bold hover:bg-cyan-700 transition-colors"
                >
                  Quick Sign In (Google)
                </button>
              </div>
            )}
          </div>

          {/* Card 2: Login Interface Simulation */}
          <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                <Smartphone className="w-4 h-4 text-cyan-600" />
                Flutter Mobile Auth Screen
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">Test social sign-in providers and passwordless credential exchange.</p>
            </div>

            <div className="space-y-3">
              {/* Google Button */}
              <button
                onClick={() => handleSimulateLogin('google')}
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 bg-white border border-slate-300 hover:bg-slate-50 text-slate-800 rounded-xl text-xs font-bold flex items-center justify-center gap-3 transition-colors shadow-2xs disabled:opacity-50"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"/>
                </svg>
                Continue with Google
              </button>

              {/* Apple Button */}
              <button
                onClick={() => handleSimulateLogin('apple')}
                disabled={isLoggingIn}
                className="w-full py-2.5 px-4 bg-black hover:bg-slate-900 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M15.97 6.37c.62-.75 1.04-1.8 0.92-2.85-.9.04-2 .6-2.64 1.35-.57.65-1.06 1.73-0.93 2.76 1.01.08 2.03-.51 2.65-1.26z"/>
                </svg>
                Sign in with Apple
              </button>
            </div>

            <div className="relative flex py-2 items-center">
              <div className="flex-grow border-t border-slate-200"></div>
              <span className="flex-shrink mx-3 text-[11px] text-slate-400 uppercase font-medium">Or continue with email</span>
              <div className="flex-grow border-t border-slate-200"></div>
            </div>

            {/* Email form */}
            <div className="space-y-3">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Email Address</label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <Mail className="w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-slate-800"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">Password</label>
                <div className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                  <KeyRound className="w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className="bg-transparent outline-none flex-1 text-slate-800 font-mono"
                  />
                </div>
              </div>

              <button
                onClick={() => handleSimulateLogin('email')}
                disabled={isLoggingIn}
                className="w-full py-2.5 bg-cyan-600 hover:bg-cyan-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
              >
                {isLoggingIn ? <RefreshCw className="w-4 h-4 animate-spin" /> : <LogIn className="w-4 h-4" />}
                Sign In with Credentials
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUBTAB 2: RIVERPOD CODE */}
      {activeSubtab === 'riverpod_code' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4" />
              lib/features/auth/presentation/controllers/auth_notifier.dart
            </span>
            <span className="text-slate-500">Riverpod 2.0 StateNotifier</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{authStateNotifierDartCode}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 3: REPO CODE */}
      {activeSubtab === 'repo_code' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="bg-slate-900 text-slate-300 px-4 py-3 flex items-center justify-between text-xs font-mono">
            <span className="text-cyan-400 flex items-center gap-2">
              <FileCode2 className="w-4 h-4" />
              lib/features/auth/data/auth_repository_impl.dart
            </span>
            <span className="text-slate-500">Google ID Token & Apple Nonce Exchange</span>
          </div>
          <pre className="p-4 text-xs font-mono bg-slate-950 text-slate-200 overflow-x-auto max-h-[480px]">
            <code>{authRepositoryDartCode}</code>
          </pre>
        </div>
      )}

      {/* SUBTAB 4: SECURITY SPEC */}
      {activeSubtab === 'security_spec' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-cyan-600" />
              Hardware-Backed Token Security
            </h4>
            <p className="text-slate-600 leading-relaxed">
              TaskFlow never writes access tokens or refresh tokens to unencrypted storage (like SharedPreferences or plain SQLite).
            </p>
            <ul className="space-y-2 text-slate-700">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>iOS:</strong> Wrapped in Keychain Services with <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">kSecAttrAccessibleAfterFirstUnlock</code>.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <span><strong>Android:</strong> KeyStore-backed <code className="bg-slate-100 px-1 py-0.5 rounded text-indigo-700">EncryptedSharedPreferences</code> using AES-256 GCM encryption.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Lock className="w-4 h-4 text-cyan-600" />
              Apple App Store Compliance
            </h4>
            <p className="text-slate-600 leading-relaxed">
              Per Section 4.8 of the Apple App Store Review Guidelines, any mobile application offering third-party social login (such as Google Sign-In) must offer "Sign in with Apple" as an equivalent option.
            </p>
            <div className="p-3 bg-cyan-50 border border-cyan-200 rounded-lg text-cyan-900">
              <span className="font-bold">Nonce Verification:</span> A SHA-256 hashed cryptographic nonce is generated locally and exchanged with Apple Identity servers to prevent replay attacks.
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
