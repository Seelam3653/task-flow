// ==============================================================================
// TASKFLOW: lib/core/notifications/notification_service.dart
// Android 14+ & iOS Exact Alarm Notification Service using flutter_local_notifications
// ==============================================================================

export const notificationServiceDartCode = `import 'package:flutter_local_notifications/flutter_local_notifications.dart';
import 'package:timezone/timezone.dart' as tz;
import 'package:timezone/data/latest_all.dart' as tz_init;

class NotificationService {
  static final NotificationService _instance = NotificationService._internal();
  factory NotificationService() => _instance;
  NotificationService._internal();

  final FlutterLocalNotificationsPlugin flutterLocalNotificationsPlugin =
      FlutterLocalNotificationsPlugin();

  // Notification Channels for Android 8.0+
  static const String taskChannelId = 'taskflow_tasks_channel';
  static const String taskChannelName = 'Task Reminders';
  static const String habitChannelId = 'taskflow_habits_channel';
  static const String habitChannelName = 'Habit Daily Nudges';
  static const String pomodoroChannelId = 'taskflow_pomodoro_channel';
  static const String pomodoroChannelName = 'Focus Session Alarms';

  Future<void> initialize() async {
    tz_init.initializeTimeZones();

    const AndroidInitializationSettings initializationSettingsAndroid =
        AndroidInitializationSettings('@mipmap/ic_launcher');

    const DarwinInitializationSettings initializationSettingsDarwin =
        DarwinInitializationSettings(
      requestAlertPermission: false,
      requestBadgePermission: false,
      requestSoundPermission: false,
    );

    const InitializationSettings initializationSettings = InitializationSettings(
      android: initializationSettingsAndroid,
      iOS: initializationSettingsDarwin,
    );

    await flutterLocalNotificationsPlugin.initialize(
      initializationSettings,
      onDidReceiveNotificationResponse: (NotificationResponse details) {
        // Navigate directly to task detail or habit tracker
      },
    );
  }

  /// Request runtime permissions for Android 13+ (POST_NOTIFICATIONS) and Exact Alarms
  Future<bool> requestPermissions() async {
    final androidImplementation = flutterLocalNotificationsPlugin
        .resolvePlatformSpecificImplementation<AndroidFlutterLocalNotificationsPlugin>();

    final bool? notificationsGranted =
        await androidImplementation?.requestNotificationsPermission();
    final bool? exactAlarmsGranted =
        await androidImplementation?.requestExactAlarmsPermission();

    return (notificationsGranted ?? false) && (exactAlarmsGranted ?? true);
  }

  /// Schedule an exact reminder for a task
  Future<void> scheduleTaskReminder({
    required int notificationId,
    required String title,
    required String body,
    required DateTime scheduledDate,
  }) async {
    final tz.TZDateTime tzScheduled = tz.TZDateTime.from(scheduledDate, tz.local);

    // If time is in the past, do not schedule
    if (tzScheduled.isBefore(tz.TZDateTime.now(tz.local))) return;

    await flutterLocalNotificationsPlugin.zonedSchedule(
      notificationId,
      title,
      body,
      tzScheduled,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          taskChannelId,
          taskChannelName,
          channelDescription: 'High-priority task deadline and reminder notifications',
          importance: Importance.max,
          priority: Priority.high,
          sound: RawResourceAndroidNotificationSound('gentle_alert'),
          enableVibration: true,
          fullScreenIntent: true, // Heads-up notification
        ),
        iOS: DarwinNotificationDetails(
          sound: 'gentle_alert.aiff',
          presentAlert: true,
          presentBadge: true,
          presentSound: true,
        ),
      ),
      androidScheduleMode: AndroidScheduleMode.exactAllowWhileIdle, // Doze mode bypass
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
    );
  }

  /// Schedule daily recurring habit reminder
  Future<void> scheduleDailyHabitNudge({
    required int habitId,
    required String habitTitle,
    required int hour,
    required int minute,
  }) async {
    final tz.TZDateTime now = tz.TZDateTime.now(tz.local);
    tz.TZDateTime scheduledDate =
        tz.TZDateTime(tz.local, now.year, now.month, now.day, hour, minute);

    if (scheduledDate.isBefore(now)) {
      scheduledDate = scheduledDate.add(const Duration(days: 1));
    }

    await flutterLocalNotificationsPlugin.zonedSchedule(
      habitId,
      'Habit Check: \$habitTitle',
      'Keep your streak alive today! Tap to mark complete.',
      scheduledDate,
      const NotificationDetails(
        android: AndroidNotificationDetails(
          habitChannelId,
          habitChannelName,
          importance: Importance.defaultImportance,
          priority: Priority.defaultPriority,
        ),
      ),
      androidScheduleMode: AndroidScheduleMode.inexactAllowWhileIdle,
      uiLocalNotificationDateInterpretation:
          UILocalNotificationDateInterpretation.absoluteTime,
      matchDateTimeComponents: DateTimeComponents.time, // Repeats daily at exact time
    );
  }

  Future<void> cancelReminder(int notificationId) async {
    await flutterLocalNotificationsPlugin.cancel(notificationId);
  }
}
`;

export const workmanagerDartCode = `import 'package:workmanager/workmanager.dart';
import '../database/app_database.dart';
import '../sync/task_repository_impl.dart';

const String syncBackgroundTaskKey = 'com.taskflow.app.periodic_sync';
const String streakCheckBackgroundTaskKey = 'com.taskflow.app.streak_watchdog';

@pragma('vm:entry-point')
void callbackDispatcher() {
  Workmanager().executeTask((task, inputData) async {
    switch (task) {
      case syncBackgroundTaskKey:
        // Flush pending local Drift mutations to Supabase while device is charging/idle
        print('Executing background sync dispatcher...');
        break;
      case streakCheckBackgroundTaskKey:
        // Audit 36-hour habit grace periods and fire push notifications
        print('Auditing habit streaks in background...');
        break;
    }
    return Future.value(true);
  });
}

class BackgroundWorkScheduler {
  static void registerPeriodicTasks() {
    Workmanager().initialize(
      callbackDispatcher,
      isInDebugMode: false,
    );

    // Schedule 15-minute background sync when network is connected
    Workmanager().registerPeriodicTask(
      'periodic-sync-worker',
      syncBackgroundTaskKey,
      frequency: const Duration(minutes: 15),
      constraints: Constraints(
        networkType: NetworkType.connected,
        requiresBatteryNotLow: true,
      ),
    );
  }
}
`;
