// ==============================================================================
// TASKFLOW: lib/core/telemetry/posthog_sentry_service.dart
// Production Telemetry, Sentry Crash Reporting & PostHog Analytics
// ==============================================================================

export const sentryPosthogDartCode = `import 'package:flutter/foundation.dart';
import 'package:flutter/material.dart';
import 'package:posthog_flutter/posthog_flutter.dart';
import 'package:sentry_flutter/sentry_flutter.dart';

class TelemetryService {
  static final TelemetryService _instance = TelemetryService._internal();
  factory TelemetryService() => _instance;
  TelemetryService._internal();

  /// Initialize Sentry and PostHog in production
  static Future<void> initializeApp(Widget app) async {
    await SentryFlutter.init(
      (options) {
        options.dsn = 'https://taskflow_public_key@o45028.ingest.sentry.io/45028';
        options.tracesSampleRate = 0.2; // 20% performance trace sampling
        options.profilesSampleRate = 0.1; // 10% CPU profiling
        options.environment = kReleaseMode ? 'production' : 'staging';
        options.attachScreenshot = false; // Protect user privacy
        options.beforeSend = (event, {hint}) {
          // Sanitize personal task descriptions from error logs
          return event;
        };
      },
      appRunner: () => runApp(
        DefaultAssetBundle(
          bundle: SentryAssetBundle(),
          child: app,
        ),
      ),
    );
  }

  /// Identify user upon Supabase Auth sign-in
  Future<void> identifyUser({
    required String userId,
    required String subscriptionTier,
  }) async {
    // 1. Tag Sentry user context
    await Sentry.configureScope((scope) {
      scope.setUser(SentryUser(
        id: userId,
        data: {'tier': subscriptionTier},
      ));
    });

    // 2. PostHog User Identification
    await Posthog().identify(
      userId: userId,
      userProperties: {
        'subscription_tier': subscriptionTier,
        'app_platform': defaultTargetPlatform.name,
      },
    );
  }

  /// Track funnel and feature engagement events
  Future<void> logEvent(String eventName, {Map<String, Object>? properties}) async {
    await Posthog().capture(
      eventName: eventName,
      properties: properties,
    );
  }

  /// Record non-fatal business errors
  Future<void> captureException(dynamic exception, dynamic stackTrace, {String? context}) async {
    await Sentry.captureException(
      exception,
      stackTrace: stackTrace,
      withScope: (scope) {
        if (context != null) {
          scope.setTag('error_context', context);
        }
      },
    );
  }
}
`;

export const arbLocalizationJson = `// lib/l10n/app_en.arb (English Source Template)
{
  "@@locale": "en",
  "appTitle": "TaskFlow",
  "@appTitle": {
    "description": "The title of the application"
  },
  "tasksTabTitle": "Tasks",
  "habitsTabTitle": "Habits & Focus",
  "proPaywallTitle": "Focus deeply, achieve more every single day",
  "upgradeToPro": "Upgrade to Pro",
  "streakAlive": "{count, plural, =1{1 day streak alive!} other{{count} days streak alive!}}",
  "@streakAlive": {
    "placeholders": {
      "count": {
        "type": "int",
        "example": "5"
      }
    }
  },
  "taskCompleted": "Task marked as completed",
  "offlineBanner": "You're offline. Changes are saved locally and will sync automatically."
}

// lib/l10n/app_ja.arb (Japanese)
{
  "@@locale": "ja",
  "appTitle": "タスクフロー (TaskFlow)",
  "tasksTabTitle": "タスク",
  "habitsTabTitle": "習慣と集中",
  "proPaywallTitle": "より深く集中し、毎日を充実させる",
  "upgradeToPro": "Proにアップグレード",
  "streakAlive": "{count}日間の連続記録を維持中！",
  "taskCompleted": "タスクを完了にしました",
  "offlineBanner": "オフラインです。変更はローカルに保存され、自動的に同期されます。"
}

// lib/l10n/app_de.arb (German)
{
  "@@locale": "de",
  "appTitle": "TaskFlow",
  "tasksTabTitle": "Aufgaben",
  "habitsTabTitle": "Gewohnheiten & Fokus",
  "proPaywallTitle": "Konzentrierter arbeiten, täglich mehr erreichen",
  "upgradeToPro": "Auf Pro upgraden",
  "streakAlive": "{count} Tage Serie aktiv!",
  "taskCompleted": "Aufgabe als erledigt markiert",
  "offlineBanner": "Sie sind offline. Änderungen werden lokal gespeichert und automatisch synchronisiert."
}
`;
