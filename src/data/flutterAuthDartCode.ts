// ==============================================================================
// TASKFLOW: lib/features/auth/data/auth_repository_impl.dart
// Supabase Auth, Google Sign-In, Sign in with Apple & Secure Storage
// ==============================================================================

export const authRepositoryDartCode = `import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import 'package:google_sign_in/google_sign_in.dart';
import 'package:sign_in_with_apple/sign_in_with_apple.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'package:crypto/crypto.dart';
import 'dart:convert';

class AuthRepositoryImpl {
  final SupabaseClient supabase = Supabase.instance.client;
  final FlutterSecureStorage secureStorage = const FlutterSecureStorage(
    aOptions: AndroidOptions(encryptedSharedPreferences: true),
    iOptions: IOSOptions(accessibility: KeychainAccessibility.first_unlock),
  );

  /// Listen to reactive auth state changes
  Stream<AuthState> get authStateChanges => supabase.auth.onAuthStateChange;

  User? get currentUser => supabase.auth.currentUser;

  /// 1. Email & Password Sign In
  Future<AuthResponse> signInWithEmail({
    required String email,
    required String password,
  }) async {
    final response = await supabase.auth.signInWithPassword(
      email: email,
      password: password,
    );
    await _persistSessionMeta(response.session);
    return response;
  }

  /// 2. Email & Password Sign Up with automated user profile row trigger
  Future<AuthResponse> signUpWithEmail({
    required String email,
    required String password,
    required String displayName,
  }) async {
    final response = await supabase.auth.signUp(
      email: email,
      password: password,
      data: {'display_name': displayName},
    );
    return response;
  }

  /// 3. Native Google Sign-In with ID Token exchange
  Future<AuthResponse> signInWithGoogle() async {
    const webClientId = '357538812533-applet.apps.googleusercontent.com';
    const iosClientId = '357538812533-ios.apps.googleusercontent.com';

    final GoogleSignIn googleSignIn = GoogleSignIn(
      clientId: iosClientId,
      serverClientId: webClientId,
    );

    final googleUser = await googleSignIn.signIn();
    if (googleUser == null) {
      throw const AuthException('Google Sign-In aborted by user.');
    }

    final googleAuth = await googleUser.authentication;
    final accessToken = googleAuth.accessToken;
    final idToken = googleAuth.idToken;

    if (idToken == null) {
      throw const AuthException('No ID Token provided by Google Identity Service.');
    }

    final response = await supabase.auth.signInWithIdToken(
      provider: OAuthProvider.google,
      idToken: idToken,
      accessToken: accessToken,
    );

    await _persistSessionMeta(response.session);
    return response;
  }

  /// 4. Native Sign in with Apple (App Store Guidelines requirement)
  Future<AuthResponse> signInWithApple() async {
    final rawNonce = supabase.auth.generateRawNonce();
    final hashedNonce = sha256.convert(utf8.encode(rawNonce)).toString();

    final credential = await SignInWithApple.getAppleIDCredential(
      scopes: [
        AppleIDAuthorizationScopes.email,
        AppleIDAuthorizationScopes.fullName,
      ],
      nonce: hashedNonce,
    );

    final idToken = credential.identityToken;
    if (idToken == null) {
      throw const AuthException('No identity token returned by Apple Sign-In.');
    }

    final response = await supabase.auth.signInWithIdToken(
      provider: OAuthProvider.apple,
      idToken: idToken,
      rawNonce: rawNonce,
    );

    await _persistSessionMeta(response.session);
    return response;
  }

  /// 5. Biometric Unlock Token Verification
  Future<bool> verifyBiometricSession() async {
    final savedToken = await secureStorage.read(key: 'taskflow_biometric_auth_token');
    if (savedToken == null) return false;
    // Verify session expiry with Supabase client
    return supabase.auth.currentSession != null && !supabase.auth.currentSession!.isExpired;
  }

  Future<void> _persistSessionMeta(Session? session) async {
    if (session != null) {
      await secureStorage.write(key: 'taskflow_refresh_token', value: session.refreshToken);
      await secureStorage.write(key: 'taskflow_user_id', value: session.user.id);
    }
  }

  /// Sign out & purge local keychain/keystore tokens
  Future<void> signOut() async {
    await secureStorage.deleteAll();
    await supabase.auth.signOut();
  }
}
`;

export const authStateNotifierDartCode = `import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'auth_repository_impl.dart';

enum AuthStatus { initial, authenticated, unauthenticated, loading }

class AuthState {
  final AuthStatus status;
  final User? user;
  final String? errorMessage;
  final bool isBiometricEnabled;

  const AuthState({
    required this.status,
    this.user,
    this.errorMessage,
    this.isBiometricEnabled = false,
  });

  AuthState copyWith({
    AuthStatus? status,
    User? user,
    String? errorMessage,
    bool? isBiometricEnabled,
  }) {
    return AuthState(
      status: status ?? this.status,
      user: user ?? this.user,
      errorMessage: errorMessage ?? this.errorMessage,
      isBiometricEnabled: isBiometricEnabled ?? this.isBiometricEnabled,
    );
  }
}

class AuthNotifier extends StateNotifier<AuthState> {
  final AuthRepositoryImpl _repo;

  AuthNotifier(this._repo) : super(const AuthState(status: AuthStatus.initial)) {
    _init();
  }

  void _init() {
    _repo.authStateChanges.listen((data) {
      if (data.session != null) {
        state = state.copyWith(status: AuthStatus.authenticated, user: data.session!.user);
      } else {
        state = state.copyWith(status: AuthStatus.unauthenticated, user: null);
      }
    });
  }

  Future<void> signInWithGoogle() async {
    state = state.copyWith(status: AuthStatus.loading);
    try {
      await _repo.signInWithGoogle();
    } catch (e) {
      state = state.copyWith(status: AuthStatus.unauthenticated, errorMessage: e.toString());
    }
  }

  Future<void> signOut() async {
    await _repo.signOut();
    state = state.copyWith(status: AuthStatus.unauthenticated, user: null);
  }
}

final authProvider = StateNotifierProvider<AuthNotifier, AuthState>((ref) {
  return AuthNotifier(AuthRepositoryImpl());
});
`;
