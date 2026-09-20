// ==============================================================================
// TASKFLOW: Local Setup Package, pubspec.yaml, and main.dart Assembly
// ==============================================================================

export const completePubspecYaml = `name: taskflow
description: "TaskFlow: Intelligent offline-first tasks, habits, and focus engine."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: ^3.5.0
  flutter: ">=3.24.0"

dependencies:
  flutter:
    sdk: flutter

  # Local Persistent Storage (Permanent Disk Storage)
  shared_preferences: ^2.3.2

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^4.0.0

flutter:
  uses-material-design: true
`;

export const localExecutionSteps = [
  {
    step: 1,
    title: "Verify Flutter SDK Installation",
    desc: "Check that Flutter 3.24+ and Android toolchain are installed and ready.",
    command: "flutter doctor",
    note: "Ensure Flutter and Android Studio show green checkmarks.",
  },
  {
    step: 2,
    title: "Create the Flutter Project",
    desc: "Create a fresh Flutter application with package ID com.taskflow.app.",
    command: "flutter create --org com.taskflow --platforms android taskflow\ncd taskflow",
    note: "This initializes native Android Gradle files and folders.",
  },
  {
    step: 3,
    title: "Add shared_preferences & Fetch Packages",
    desc: "Replace pubspec.yaml (or run flutter pub add) and fetch dependencies.",
    command: "flutter pub add shared_preferences\nflutter pub get",
    note: "No complicated code generation or external cloud accounts required to run!",
  },
  {
    step: 4,
    title: "Paste lib/main.dart",
    desc: "Copy the full production Dart code from the Starter lib/main.dart tab into your local lib/main.dart file.",
    command: "# Open lib/main.dart in VS Code / Android Studio and paste the code from Tab 3",
    note: "Contains Tasks with AI breakdown, Habit Streaks, Pomodoro Focus Timer, and Local Disk Persistence.",
  },
  {
    step: 5,
    title: "Run on Connected Android Phone or Emulator",
    desc: "Connect your physical phone with USB debugging enabled or launch an emulator.",
    command: "flutter run",
    note: "Hot reload is active: press 'r' in terminal to apply code changes instantly.",
  },
  {
    step: 6,
    title: "Build the Release APK / AAB for Google Play",
    desc: "When ready to install or upload to Google Play, build the optimized release package.",
    command: "flutter build apk --release\n# Or for Google Play Store upload:\nflutter build appbundle --release",
    note: "APK will be generated at: build/app/outputs/flutter-apk/app-release.apk",
  },
];
