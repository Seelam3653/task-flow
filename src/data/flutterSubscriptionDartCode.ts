// ==============================================================================
// TASKFLOW: lib/features/subscription/data/subscription_repository_impl.dart
// Purchases_flutter (RevenueCat) Cross-Platform Subscription & Entitlement Engine
// ==============================================================================

export const subscriptionRepositoryDartCode = `import 'package:purchases_flutter/purchases_flutter.dart';
import 'package:supabase_flutter/supabase_flutter.dart';
import 'dart:io';

class SubscriptionRepositoryImpl {
  final SupabaseClient _supabase = Supabase.instance.client;

  static const String proEntitlementIdentifier = 'pro_access';
  static const String monthlySubscriptionId = 'taskflow_pro_monthly_499';
  static const String annualSubscriptionId = 'taskflow_pro_annual_3999';
  static const String lifetimePurchaseId = 'taskflow_pro_lifetime_7999';

  /// Initialize RevenueCat SDK with user ID link to Supabase Auth
  Future<void> initialize({required String userId}) async {
    await Purchases.setLogLevel(LogLevel.debug);

    PurchasesConfiguration configuration;
    if (Platform.isAndroid) {
      configuration = PurchasesConfiguration('goog_play_api_key_public_taskflow')
        ..appUserID = userId;
    } else if (Platform.isIOS) {
      configuration = PurchasesConfiguration('appl_appstore_api_key_public_taskflow')
        ..appUserID = userId;
    } else {
      return;
    }

    await Purchases.configure(configuration);
  }

  /// Fetch paywall offerings configured in RevenueCat dashboard
  Future<Offerings?> fetchOfferings() async {
    try {
      final offerings = await Purchases.getOfferings();
      return offerings;
    } catch (e) {
      print('Error fetching paywall offerings: \$e');
      return null;
    }
  }

  /// Purchase package (Monthly, Annual, or Lifetime)
  Future<CustomerInfo> purchasePackage(Package package) async {
    try {
      final customerInfo = await Purchases.purchasePackage(package);
      await _syncSubscriptionToSupabase(customerInfo);
      return customerInfo;
    } catch (e) {
      rethrow;
    }
  }

  /// Restore previous App Store or Google Play transactions
  Future<CustomerInfo> restorePurchases() async {
    try {
      final customerInfo = await Purchases.restorePurchases();
      await _syncSubscriptionToSupabase(customerInfo);
      return customerInfo;
    } catch (e) {
      rethrow;
    }
  }

  /// Check Pro status directly from active entitlements
  Future<bool> isUserPro() async {
    try {
      final customerInfo = await Purchases.getCustomerInfo();
      return customerInfo.entitlements.all[proEntitlementIdentifier]?.isActive ?? false;
    } catch (e) {
      return false;
    }
  }

  /// Sync entitlement status to user_settings table via Supabase RPC
  Future<void> _syncSubscriptionToSupabase(CustomerInfo customerInfo) async {
    final bool isPro = customerInfo.entitlements.all[proEntitlementIdentifier]?.isActive ?? false;
    final String? expirationDate = customerInfo.entitlements.all[proEntitlementIdentifier]?.expirationDate;
    
    await _supabase.rpc('update_user_subscription_status', params: {
      'is_pro': isPro,
      'tier': isPro ? 'pro' : 'free',
      'expires_at': expirationDate,
    });
  }
}
`;

export const revenueCatWebhookDenoDartCode = `// ==============================================================================
// TASKFLOW: supabase/functions/revenuecat-webhook/index.ts
// Supabase Edge Function (Deno) handling RevenueCat Webhook Events
// ==============================================================================

import { serve } from 'https://deno.land/std@0.177.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const REVENUECAT_WEBHOOK_AUTH = Deno.env.get('REVENUECAT_WEBHOOK_AUTH_BEARER')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

serve(async (req) => {
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // 1. Verify RevenueCat Webhook Secret
  const authHeader = req.headers.get('Authorization');
  if (authHeader !== \`Bearer \${REVENUECAT_WEBHOOK_AUTH}\`) {
    return new Response('Unauthorized', { status: 401 });
  }

  const body = await req.json();
  const event = body.event;
  const appUserId = event.app_user_id; // Maps to Supabase user_id
  const eventType = event.type; // INITIAL_PURCHASE, RENEWAL, CANCELLATION, EXPIRATION

  console.log(\`Received RevenueCat Event: \${eventType} for user \${appUserId}\`);

  let isPro = false;
  if (['INITIAL_PURCHASE', 'RENEWAL', 'NON_RENEWING_PURCHASE', 'UNCANCELLATION'].includes(eventType)) {
    isPro = true;
  } else if (['EXPIRATION', 'BILLING_ISSUE'].includes(eventType)) {
    isPro = false;
  }

  // 2. Update user_settings record with service role bypassing RLS
  const { error } = await supabase
    .from('user_settings')
    .update({
      tier: isPro ? 'pro' : 'free',
      subscription_status: eventType.toLowerCase(),
      updated_at: new Date().toISOString(),
    })
    .eq('user_id', appUserId);

  if (error) {
    console.error('Failed to update subscription in Supabase:', error);
    return new Response(JSON.stringify({ error: error.message }), { status: 500 });
  }

  return new Response(JSON.stringify({ success: true, user_id: appUserId, is_pro: isPro }), {
    headers: { 'Content-Type': 'application/json' },
  });
});
`;
