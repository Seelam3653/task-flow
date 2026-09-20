// ==============================================================================
// TASKFLOW: Local Setup Package, pubspec.yaml, and main.dart Assembly
// ==============================================================================

export const completePubspecYaml = `name: taskflow
description: "TaskFlow: Intelligent offline-first tasks, habits, and focus engine."
publish_to: 'none'
version: 1.0.0+1

environment:
  sdk: ">=3.4.0 <4.0.0"
  flutter: ">=3.22.0"

dependencies:
  flutter:
    sdk: flutter

  # Local Persistent Storage (Permanent Disk Storage - Latest Stable)
  shared_preferences: ^2.5.5

dev_dependencies:
  flutter_test:
    sdk: flutter
  flutter_lints: ^6.0.0

flutter:
  uses-material-design: true
`;

export const localExecutionSteps = [
  {
    step: 1,
    title: "Verify Flutter & Android Environment",
    desc: "Ensure Flutter SDK (>=3.22.0) and Android command-line tools/Java are properly configured.",
    command: "flutter doctor",
    note: "All checks for Flutter, Android toolchain, and Chrome/connected devices should be green.",
  },
  {
    step: 2,
    title: "Option A: Use Existing /taskflow Codebase (Recommended)",
    desc: "If you exported/cloned the project files directly from this app, enter the taskflow folder and generate platform wrappers.",
    command: "cd taskflow\nflutter create --org com.taskflow.app .\nflutter pub get",
    note: "Running 'flutter create .' in the existing folder automatically creates android/ and ios/ native folders matching your local machine without overwriting lib/ or pubspec.yaml!",
  },
  {
    step: 3,
    title: "Option B: Fresh Project Setup with Clean Modular Architecture",
    desc: "If starting from scratch in an empty directory, create the project and install shared_preferences ^2.5.5.",
    command: "flutter create --org com.taskflow.app taskflow\ncd taskflow\nflutter pub add shared_preferences:^2.5.5\nflutter pub add dev:flutter_lints:^6.0.0",
    note: "Populate the modular folders: lib/models/, lib/services/, lib/screens/, lib/widgets/ using Tab 1 (Modular Files Explorer).",
  },
  {
    step: 4,
    title: "Run Code Analysis & Verification",
    desc: "Validate that all imports, types, and const constructors satisfy the Flutter 3.24+ linter.",
    command: "flutter analyze",
    note: "Should report 'No issues found!' confirming zero syntax or type issues.",
  },
  {
    step: 5,
    title: "Launch on Device / Emulator (Offline Persistence Active)",
    desc: "Run on a connected Android phone via USB debugging, an Android Studio Emulator, or Chrome.",
    command: "flutter run",
    note: "Hot reload is active: press 'r' in terminal to apply code changes instantly, or 'R' for full restart.",
  },
  {
    step: 6,
    title: "Build Production Release (APK or Google Play AAB)",
    desc: "Compile an optimized, signed release bundle ready for testing or Google Play Console upload.",
    command: "# For local testing on any Android device:\nflutter build apk --release\n\n# For Google Play Store submission (AAB):\nflutter build appbundle --release",
    note: "Production APK generated at: build/app/outputs/flutter-apk/app-release.apk. Production AAB at: build/app/outputs/bundle/release/app-release.aab.",
  },
];
