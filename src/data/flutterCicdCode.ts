// ==============================================================================
// TASKFLOW: CI/CD, Fastlane & Automated Store Deployment Configurations
// ==============================================================================

export const githubActionsCiWorkflowYaml = `name: TaskFlow Mobile CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]
  release:
    types: [ published ]

jobs:
  # ---------------------------------------------------------------------------
  # 1. Quality Gate: Analyze, Format & Unit / Drift Database Tests
  # ---------------------------------------------------------------------------
  quality_gate:
    name: Flutter Lint & Unit Tests
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Java 17
        uses: actions/setup-java@v4
        with:
          distribution: 'temurin'
          java-version: '17'

      - name: Setup Flutter 3.24+
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          channel: 'stable'
          cache: true

      - name: Install Dependencies
        run: flutter pub get

      - name: Verify Formatting
        run: dart format --output=none --set-exit-if-changed .

      - name: Run Static Code Analysis
        run: flutter analyze --fatal-infos --fatal-warnings

      - name: Run Test Suite with Coverage
        run: flutter test --coverage

  # ---------------------------------------------------------------------------
  # 2. Android Build & Google Play Internal Track Deployment
  # ---------------------------------------------------------------------------
  deploy_android:
    name: Build & Deploy Android (AAB)
    needs: quality_gate
    if: github.ref == 'refs/heads/main' || github.event_name == 'release'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          cache: true

      - name: Setup Ruby for Fastlane
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
          working-directory: android

      - name: Decode Android Upload Keystore
        run: |
          echo "\${{ secrets.ANDROID_KEYSTORE_BASE64 }}" | base64 --decode > android/app/upload-keystore.jks
          echo "\${{ secrets.PLAY_STORE_JSON_KEY }}" > android/fastlane/play_store_api_key.json

      - name: Deploy to Google Play Internal Track via Fastlane
        working-directory: android
        env:
          KEYSTORE_PASSWORD: \${{ secrets.KEYSTORE_PASSWORD }}
          KEY_ALIAS: \${{ secrets.KEY_ALIAS }}
          KEY_PASSWORD: \${{ secrets.KEY_PASSWORD }}
        run: bundle exec fastlane deploy_internal

  # ---------------------------------------------------------------------------
  # 3. iOS Build & Apple TestFlight Deployment
  # ---------------------------------------------------------------------------
  deploy_ios:
    name: Build & Deploy iOS (TestFlight)
    needs: quality_gate
    if: github.ref == 'refs/heads/main' || github.event_name == 'release'
    runs-on: macos-14 # Apple Silicon M2 runner
    steps:
      - uses: actions/checkout@v4

      - name: Setup Flutter
        uses: subosito/flutter-action@v2
        with:
          flutter-version: '3.24.x'
          cache: true

      - name: Setup Ruby for Fastlane
        uses: ruby/setup-ruby@v1
        with:
          ruby-version: '3.2'
          bundler-cache: true
          working-directory: ios

      - name: Deploy to TestFlight via Fastlane Match
        working-directory: ios
        env:
          APP_STORE_CONNECT_API_KEY_KEY_ID: \${{ secrets.APP_STORE_KEY_ID }}
          APP_STORE_CONNECT_API_KEY_ISSUER_ID: \${{ secrets.APP_STORE_ISSUER_ID }}
          APP_STORE_CONNECT_API_KEY_KEY: \${{ secrets.APP_STORE_PRIVATE_KEY }}
          MATCH_PASSWORD: \${{ secrets.MATCH_PASSWORD }}
          MATCH_GIT_URL: \${{ secrets.MATCH_GIT_URL }}
        run: bundle exec fastlane beta
`;

export const fastlaneAndroidFastfile = `# android/fastlane/Fastfile
default_platform(:android)

platform :android do
  desc "Runs unit tests and linter"
  lane :test do
    gradle(task: "test")
  end

  desc "Build release Android App Bundle (AAB) and deploy to Google Play Internal Track"
  lane :deploy_internal do
    # Fetch current version code from Play Store and increment
    current_version_code = google_play_track_version_codes(
      package_name: "com.taskflow.app",
      track: "internal",
      json_key: "fastlane/play_store_api_key.json"
    ).max || 1

    next_version_code = current_version_code + 1

    sh("flutter build appbundle --release --build-number=#{next_version_code}")

    upload_to_play_store(
      package_name: "com.taskflow.app",
      track: "internal",
      aab: "../build/app/outputs/bundle/release/app-release.aab",
      json_key: "fastlane/play_store_api_key.json",
      skip_upload_metadata: true,
      skip_upload_images: true,
      skip_upload_screenshots: true
    )
  end
end
`;

export const fastlaneIosFastfile = `# ios/fastlane/Fastfile
default_platform(:ios)

platform :ios do
  desc "Fetch certificates and provisioning profiles via Match, build IPA, and push to TestFlight"
  lane :beta do
    api_key = app_store_connect_api_key(
      key_id: ENV["APP_STORE_CONNECT_API_KEY_KEY_ID"],
      issuer_id: ENV["APP_STORE_CONNECT_API_KEY_ISSUER_ID"],
      key_content: ENV["APP_STORE_CONNECT_API_KEY_KEY"],
      is_key_content_base64: true
    )

    # Sync App Store certificates from private encrypted Git repo
    match(
      type: "appstore",
      readonly: is_ci,
      api_key: api_key
    )

    # Increment build number from TestFlight latest
    increment_build_number(
      build_number: latest_testflight_build_number(api_key: api_key) + 1,
      xcodeproj: "Runner.xcodeproj"
    )

    # Build signed iOS IPA with Flutter
    sh("flutter build ipa --release --export-options-plist=ios/ExportOptions.plist")

    # Upload to Apple TestFlight
    upload_to_testflight(
      api_key: api_key,
      ipa: "../build/ios/ipa/taskflow.ipa",
      skip_waiting_for_build_processing: true
    )
  end
end
`;
