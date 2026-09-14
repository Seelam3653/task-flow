// ==============================================================================
// TASKFLOW: Google Play Store Release Specifications & Store Listing Metadata
// ==============================================================================

export const googlePlayListingCopy = {
  appName: "TaskFlow: AI Tasks & Habits", // 27 / 30 chars
  shortDescription: "Smart task planner, habit streak tracker, Pomodoro timer & AI task breakdowns.", // 79 / 80 chars
  fullDescription: `Boost your daily productivity and conquer procrastination with TaskFlow — the intelligent, offline-first task manager and habit tracker powered by AI.

Whether you are organizing complex work projects, building daily wellness habits, or staying in deep focus using the Pomodoro technique, TaskFlow keeps your mind clear and your goals on track.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
✨ KEY PRODUCTIVITY FEATURES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🤖 AI Subtask Decomposer (Powered by Gemini)
• Break down overwhelming, vague tasks (e.g., "Launch quarterly marketing campaign") into actionable, bite-sized checklists with one tap.
• Automatically estimates completion times and cognitive load to prevent burnout.

🔥 Habit Streak & Consistency Tracker
• Build lasting habits with flexible scheduling (Daily, Weekdays, Custom days).
• Visual streak counters, completion percentages, and milestone celebrations keep motivation high.

⏱️ Integrated Pomodoro Focus Engine
• 25/5 minute deep work intervals with customizable timers.
• Built-in ambient focus soundscapes (Rain, White Noise, Forest, Cafe).
• Automatically links completed focus sessions to your task analytics.

⚡ 100% Offline-First with Instant Sync
• Fully functional without internet connection. Every task, habit, and note is stored locally in high-speed SQLite/Drift.
• Seamless 2-way background synchronization flushes changes to secure cloud storage the moment connection restores.

📊 Cognitive Load & Burnout Guard
• Real-time workload scoring warns you when you have overcommitted for the day.
• Eisenhower priority matrix (Urgent, High, Medium, Low) ensures you focus on high-impact work.

🔔 Reliable Alarms & Reminders
• Exact alarm scheduling guarantees notifications fire even when your phone is in deep Android Doze mode.
• Customizable snooze, sound alerts, and quiet hours.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔒 PRIVACY & SECURITY FIRST
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Zero Tracking of Task Content: Your tasks, habit titles, and personal notes are encrypted in transit and never sold to third parties.
• Transparent Data Safety: Fully compliant with Google Play Data Safety policies.
• Instant Account & Data Deletion: Complete control over your personal data directly from the in-app settings.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💎 TASKFLOW PRO (OPTIONAL)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Upgrade to unlock unlimited active tasks, unlimited habit trackers, prioritized AI decomposition, and historical productivity matrix analytics. Available as a monthly, annual (save 33%), or lifetime purchase.

Transform how you plan, focus, and achieve. Download TaskFlow today!`,
  category: "Productivity",
  contentRating: "Everyone / PEGI 3",
  targetAudience: "General Public (Ages 18+)",
  supportEmail: "support@taskflow.app",
  privacyPolicyUrl: "https://taskflow.app/privacy",
  termsUrl: "https://taskflow.app/terms",
  accountDeletionUrl: "https://taskflow.app/account/delete",
};

export const googlePlayDataSafetyAnswers = [
  {
    category: "Personal Info",
    dataTypes: [
      {
        name: "Email address",
        collected: true,
        shared: false,
        required: true,
        purposes: ["App functionality (Supabase Auth account creation)", "Account management"],
      },
      {
        name: "Name (Optional)",
        collected: true,
        shared: false,
        required: false,
        purposes: ["Personalization in app interface"],
      },
    ],
  },
  {
    category: "Financial Info",
    dataTypes: [
      {
        name: "User payment info & purchase history",
        collected: true,
        shared: false,
        required: false,
        purposes: ["App functionality (In-app subscriptions via Google Play Billing & RevenueCat)"],
      },
    ],
  },
  {
    category: "App Activity",
    dataTypes: [
      {
        name: "App interactions",
        collected: true,
        shared: false,
        required: true,
        purposes: ["Analytics (PostHog anonymous feature engagement & funnels)"],
      },
    ],
  },
  {
    category: "App Info and Performance",
    dataTypes: [
      {
        name: "Crash logs & Diagnostics",
        collected: true,
        shared: false,
        required: true,
        purposes: ["Analytics (Sentry crash reporting & performance monitoring)"],
      },
    ],
  },
  {
    category: "Device or Other IDs",
    dataTypes: [
      {
        name: "Device ID / Anonymous Installation ID",
        collected: true,
        shared: false,
        required: true,
        purposes: ["Analytics, Fraud prevention, and Cloud Messaging delivery"],
      },
    ],
  },
];

export const exactAlarmDeclarationText = `TaskFlow is a productivity, reminder, and task management application. 

The core user experience depends directly on delivering time-sensitive reminders for tasks, calendar deadlines, and Pomodoro focus intervals at the exact minute configured by the user. 

If exact alarms are not permitted, the operating system's Doze mode defers background alarms, causing users to miss scheduled medications, critical business meetings, task deadlines, and break timers. 

The USE_EXACT_ALARM permission is used solely for user-scheduled task notifications and focus timer expirations, matching Google Play's Reminders/Calendar core app category exemption.`;

export const androidSigningGuide = {
  keytoolCommand: `keytool -genkey -v -keystore upload-keystore.jks -keyalg RSA -keysize 2048 -validity 10000 -alias upload`,
  keyProperties: `storePassword=YOUR_KEYSTORE_PASSWORD
keyPassword=YOUR_KEY_PASSWORD
keyAlias=upload
storeFile=../upload-keystore.jks`,
  buildGradleSnippet: `// android/app/build.gradle.kts
val keystorePropertiesFile = rootProject.file("key.properties")
val keystoreProperties = Properties()
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(FileInputStream(keystorePropertiesFile))
}

android {
    signingConfigs {
        create("release") {
            keyAlias = keystoreProperties["keyAlias"] as String
            keyPassword = keystoreProperties["keyPassword"] as String
            storeFile = file(keystoreProperties["storeFile"] as String)
            storePassword = keystoreProperties["storePassword"] as String
        }
    }
    buildTypes {
        release {
            signingConfig = signingConfigs.getByName("release")
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
        }
    }
}`,
  buildAabCommand: `flutter build appbundle --release`,
};
