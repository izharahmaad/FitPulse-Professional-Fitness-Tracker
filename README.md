<h1 align="center">FitPulse</h1>

<p align="center">
  <strong>A local-first fitness companion for real step tracking, calorie awareness, hydration, weight logging, and useful daily analytics.</strong>
</p>

<p align="center">
  React Native • Expo SDK 57 • TypeScript • Expo Router • Pedometer • AsyncStorage • Local Notifications
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React%20Native-Mobile-61DAFB?logo=react&logoColor=black" alt="React Native">
  <img src="https://img.shields.io/badge/Expo-SDK%2057-000020?logo=expo&logoColor=white" alt="Expo SDK 57">
  <img src="https://img.shields.io/badge/TypeScript-Strict-3178C6?logo=typescript&logoColor=white" alt="TypeScript">
  <img src="https://img.shields.io/badge/Data-Local--First-2EA44F" alt="Local First">
  <img src="https://img.shields.io/badge/Steps-Real%20Pedometer-FF5A5F" alt="Real Pedometer">
  <img src="https://img.shields.io/badge/License-MIT-black" alt="MIT License">
</p>

---

## Overview

**FitPulse** is a local-first React Native fitness app built with **Expo SDK 57**, **TypeScript**, and **Expo Router**. It helps users understand their daily activity through real device pedometer readings, calorie targets, hydration tracking, weight entries, local reminders, and practical analytics.

The core idea is simple:

> **Track real movement, understand daily habits, and turn small health actions into a sustainable routine.**

Unlike many prototype fitness apps, FitPulse deliberately does **not** fabricate step data. It uses the device's Pedometer sensor while the app is active, persists observed daily totals locally, and communicates sensor limitations honestly in the user experience.

> **Important:** FitPulse is a personal wellness tool. Distance, calorie, and activity calculations are estimates and are not medical advice, clinical measurements, or a substitute for professional healthcare guidance.


## Why FitPulse?

A useful personal fitness app should make it easy to answer everyday questions:

- How many steps have I actually observed today?
- How close am I to my daily movement goal?
- What is a reasonable calorie target for my profile and goal?
- Did I drink enough water?
- How has my weight changed over time?
- Which reminders help me stay consistent without becoming distracting?

FitPulse focuses on an honest, privacy-friendly, local-first workflow:

```text
Profile + Goals
      │
      ▼
Real Foreground Pedometer Data
      │
      ▼
Daily Steps / Distance / Walking Estimates
      │
      ▼
Calories + Food Logs + Water + Weight
      │
      ▼
Local Persistence and Personal Analytics
      │
      ▼
Habit-Building Notifications
```

---

## Important Step-Tracking Reality

FitPulse intentionally does **not** fake step values.

The app uses Expo's `expo-sensors` Pedometer API for real device sensor data. However, a standard Pedometer subscription does not become a true background step collector just because the app is built with Expo or installed as a development build.

### What FitPulse implements

| Capability | Implementation |
|---|---|
| **Foreground step tracking** | Uses `Pedometer.watchStepCount()` while the app is active |
| **Android permission handling** | Requests and handles `ACTIVITY_RECOGNITION` permission where required |
| **iOS motion permission** | Uses Pedometer availability and permission APIs supported by iOS |
| **Persistent daily totals** | Saves previously observed daily step totals with AsyncStorage |
| **iOS historical reconciliation** | Uses `Pedometer.getStepCountAsync(start, end)` where supported |
| **Transparent tracking state** | Clearly communicates foreground sensor tracking rather than claiming unavailable background behavior |
| **Future-ready service boundary** | Keeps pedometer logic behind `services/pedometer.ts` for a future Health Connect adapter |

### What FitPulse does not claim

```text
No fake/mock step incrementer in production code
No guaranteed Android background pedometer collection
No guaranteed full historical step retrieval on every platform/device
No clinical-grade exercise or calorie measurement
```

### Background/history tracking

For a true Android background/history step-data requirement, integrate a health-data provider such as **Android Health Connect**. The current Pedometer service boundary is deliberately separated from screens and storage so a future adapter can be introduced without rewriting the UI or the central fitness store.

---

## Core Features

| Feature | Description |
|---|---|
| **Real Pedometer Data** | Reads genuine device step sensor data while FitPulse is active |
| **Daily Step Goals** | Lets users set and monitor a daily step target |
| **Calorie Tracking** | Supports calorie goals and food-log entries |
| **Personalized Calorie Target** | Derives a default target from profile, activity, and weight goal |
| **Hydration Tracking** | Records daily water intake against a customizable target |
| **Weight Tracking** | Stores weight entries for long-term progress review |
| **Useful Analytics** | Shows daily progress, trends, summaries, and personal statistics |
| **Local Notifications** | Provides water, meal, step-goal, weight-check, and inactivity reminders |
| **Local-First Storage** | Keeps personal data on-device with AsyncStorage |
| **Privacy-Focused Design** | Does not require a backend account for core tracking |
| **Responsive Mobile UI** | Built for Android/iOS using React Native and Expo Router |
| **Backend-Ready Architecture** | Separates storage and domain logic so cloud sync can be introduced later |

---

## System Architecture

```text
                    ┌─────────────────────────────┐
                    │        FitPulse Mobile      │
                    │ React Native + Expo Router  │
                    └──────────────┬──────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
     ┌────────────────┐   ┌────────────────┐   ┌────────────────┐
     │ Pedometer API  │   │ User Actions   │   │ Local Reminders│
     │ expo-sensors   │   │ food/water/    │   │ expo-notifs    │
     │ foreground data│   │ weight/profile │   │ on-device      │
     └───────┬────────┘   └───────┬────────┘   └───────┬────────┘
             │                    │                    │
             └────────────┬───────┴────────────┬───────┘
                          ▼                    ▼
                ┌────────────────────────────────────┐
                │         FitnessProvider            │
                │  goals • totals • logs • analytics │
                └──────────────────┬─────────────────┘
                                   │
                                   ▼
                ┌────────────────────────────────────┐
                │          Service Layer             │
                │ storage • pedometer • calories     │
                │ notifications • formatting         │
                └──────────────────┬─────────────────┘
                                   │
                                   ▼
                ┌────────────────────────────────────┐
                │          AsyncStorage              │
                │ Profile • goals • daily totals     │
                │ Food • water • weight • preferences│
                └────────────────────────────────────┘
```

---

## Application Flow

```text
First Launch
     │
     ▼
Profile Setup
(age, height, weight, activity, goals)
     │
     ▼
Dashboard
     │
     ├──► Steps
     │      │
     │      ├──► Request activity/motion permission
     │      ├──► Read foreground pedometer data
     │      └──► Persist daily observed total
     │
     ├──► Calories
     │      │
     │      └──► Food logs and calorie-goal progress
     │
     ├──► Water
     │      │
     │      └──► Hydration logs and reminders
     │
     ├──► Weight
     │      │
     │      └──► Weight entries and goal comparison
     │
     └──► Statistics
            │
            └──► Trends, summaries, and insights
```

---

## Project Structure

```text
FitPulse-Professional-Fitness-Tracker/
│
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx          # Dashboard
│   │   ├── steps.tsx          # Step tracking and sensor status
│   │   ├── calories.tsx       # Calorie summary and food logs
│   │   ├── water.tsx          # Hydration tracking
│   │   ├── weight.tsx         # Weight entries and goals
│   │   ├── statistics.tsx     # Progress analytics
│   │   ├── profile.tsx        # User profile and goals
│   │   ├── settings.tsx       # Preferences and notification settings
│   │   └── _layout.tsx        # Tab navigation layout
│   │
│   ├── add-food.tsx           # Food-log entry route
│   ├── settings.tsx           # Additional settings route
│   └── _layout.tsx            # Root Expo Router layout
│
├── assets/
│   └── README.md              # Asset notes / placement guidance
│
├── components/
│   ├── ui.tsx                 # Shared UI primitives
│   ├── ProgressRing.tsx       # Circular progress visualization
│   └── MiniChart.tsx          # Lightweight chart component
│
├── constants/
│   └── theme.ts               # Colors, spacing, typography tokens
│
├── hooks/
│   ├── useFitness.ts          # FitnessProvider access hook
│   └── usePedometer.ts        # Pedometer data and sensor-state hook
│
├── services/
│   ├── storage.ts             # AsyncStorage persistence layer
│   ├── pedometer.ts           # Device step-sensor abstraction
│   ├── notifications.ts       # Local-notification scheduling
│   └── calories.ts            # BMR, TDEE, walking estimate helpers
│
├── store/
│   └── FitnessProvider.tsx    # Central fitness state and actions
│
├── types/
│   └── fitness.ts             # Shared TypeScript domain models
│
├── utils/
│   ├── calorie.test.ts        # Calorie utility tests
│   ├── date.ts                # Date helpers
│   └── format.ts              # Display formatting helpers
│
├── app.json                   # Expo + platform configuration
├── eslint.config.js
├── expo-env.d.ts
├── package.json
├── tsconfig.json
└── README.md
```

---

## Data Model

FitPulse stores personal data locally using **AsyncStorage**.

```text
Profile
├── age
├── biological sex (optional / used for formula selection)
├── height
├── current weight
├── activity level
└── goals

Goals
├── daily step goal
├── calorie goal
├── water goal
├── target weight
└── weight-goal direction

Daily Fitness Data
├── observed step totals
├── food logs
├── water logs
├── weight entries
└── notification settings

App Preferences
├── units
├── tracking preferences
└── reminder preferences
```

### Local-first storage policy

```text
All primary personal data stays on the device.
        │
        ▼
AsyncStorage persists profile, goals, totals, and logs.
        │
        ▼
A future Firebase / Supabase / REST API adapter can replace
services/storage.ts without requiring screen-level rewrites.
```

---

## Calorie Formulas

FitPulse uses the **Mifflin–St Jeor** equation to estimate basal metabolic rate (BMR).

### Male

```text
BMR = 10W + 6.25H - 5A + 5
```

### Female

```text
BMR = 10W + 6.25H - 5A - 161
```

Where:

```text
W = weight in kilograms
H = height in centimeters
A = age in years
```

### Total daily energy expenditure

```text
TDEE = BMR × activity multiplier
```

The default calorie goal is derived from estimated TDEE and the selected weight goal. Users can override the suggested calorie goal in the application.

> **Wellness note:** BMR, TDEE, walking calories, and weight-goal suggestions are general estimates. They should not be used as medical advice or as a substitute for guidance from a qualified health professional.

---

## Walking Estimates

FitPulse derives estimates from observed step totals using a configurable stride approximation.

```text
Steps
  │
  ▼
Estimated distance
  │
  ▼
Body weight + conservative walking MET
  │
  ▼
Estimated walking calories
```

These values are intentionally presented as estimates rather than precision measurements.

---

## Notifications

FitPulse schedules local, on-device notifications only when a reminder is enabled.

| Reminder | Purpose |
|---|---|
| **Water reminder** | Encourages regular hydration |
| **Meal reminder** | Helps maintain food-log consistency |
| **Step-goal reminder** | Encourages movement before the day ends |
| **Weight check reminder** | Prompts periodic weight logging |
| **Inactivity reminder** | Encourages a short movement break |

Users can enable or disable reminder categories individually.

> Remote push notifications are not required for FitPulse because reminders are personal, device-local schedules.

---

## Installation

### Requirements

- Node.js compatible with Expo SDK 57
- npm
- Android Studio for local Android builds, or an EAS Build account
- A physical Android or iOS device for meaningful pedometer testing
- Expo Go for quick UI development, or a development build for production-oriented native testing

### 1. Clone the repository

```bash
git clone https://github.com/<YOUR_USERNAME>/FitPulse-Professional-Fitness-Tracker.git
cd FitPulse-Professional-Fitness-Tracker
```

### 2. Install dependencies

```bash
npm install
```

### 3. Start Expo

```bash
npx expo start
```

### 4. Type-check the project

```bash
npm run typecheck
```

---

## Expo Go vs Development Build

### Quick UI development

```bash
npm install
npx expo start
```

Expo Go is suitable for rapid UI work and basic Pedometer testing when the module is supported on the device.

### Production-oriented native testing

```bash
npx expo install
npx expo run:android
```

Or use an EAS development build.

```text
A development build does not automatically change the Pedometer API
into a true background step collector.

For genuine Android background/history access, add a Health Connect
integration or another platform-specific health-data adapter.
```

---

## First-Run Flow

```text
1. Open FitPulse
2. Go to Profile
3. Enter age, height, weight, activity level, and goals
4. Open Steps
5. Grant activity/motion permission
6. Keep FitPulse active while validating sensor readings
7. Configure notification preferences if desired
8. Track daily progress from the dashboard
```

---

## Pedometer Service Design

The sensor logic is intentionally isolated behind a service boundary.

```text
Screens / Hooks
      │
      ▼
usePedometer.ts
      │
      ▼
services/pedometer.ts
      │
      ├──► Expo Pedometer (current foreground provider)
      │
      └──► Future Health Connect Adapter (Android history/background)
```

This prevents platform-specific sensor behavior from leaking into screen components and makes the app easier to extend later.

---

## Current Development Status

### Implemented

- [x] Local-first AsyncStorage persistence
- [x] Profile and health-goal setup
- [x] Foreground device pedometer tracking
- [x] Android activity-recognition permission handling
- [x] iOS Pedometer support where available
- [x] Persistent observed daily totals
- [x] iOS historical reconciliation path where supported
- [x] Step-goal progress UI
- [x] Calorie-goal estimation and food logs
- [x] Water tracking
- [x] Weight logging
- [x] Statistics and trend views
- [x] Local reminder scheduling
- [x] Backend-ready storage/service separation

### Next steps

- [ ] Android Health Connect integration
- [ ] True Android background/history step synchronization
- [ ] Apple Health integration
- [ ] Cloud backup / optional account sync
- [ ] CSV / PDF export of personal data
- [ ] Additional chart types and long-range comparisons
- [ ] Accessibility review and screen-reader refinement
- [ ] Automated integration tests for storage and notification flows
- [ ] CI/CD for Android preview and production builds

---

## Production Checklist

Before publishing FitPulse:

```text
Test Pedometer behavior on multiple physical Android devices and iPhones
Verify Android ACTIVITY_RECOGNITION permission behavior
Verify iOS motion permission behavior
Test Android battery optimization and vendor-specific restrictions
Add Android Health Connect if background/history steps are a hard requirement
Test all local notifications on real devices
Add final app icon and splash assets
Configure EAS project ID and production credentials
Add a privacy policy and app-store disclosures for activity data
Run npm run typecheck
Build a release binary and test permissions/notifications again
```

---

## Important Engineering Decisions

### No fake steps

FitPulse does not include a production mock step incrementer. Step values shown by the app come from observed device sensor readings or supported historical reconciliation paths.

### Honest tracking status

The UI should communicate **foreground sensor tracking** rather than making an unsupported promise that steps are continuously tracked in the background.

### Local-first by default

The core app does not require sign-in or a remote backend. This reduces setup friction and keeps personal wellness data under the user's direct control on the device.

### Backend-ready architecture

The screen layer depends on hooks/provider state rather than directly on AsyncStorage. A future cloud adapter can be added through the service/store layer instead of requiring a screen rewrite.

---

## Limitations

FitPulse is a personal fitness and wellness tracker, not a medical device.

1. **Foreground Pedometer limitation:** `Pedometer.watchStepCount()` does not provide guaranteed background tracking.
2. **Platform/device differences:** pedometer availability, permissions, history access, and battery behavior vary by device and operating system.
3. **Estimated metrics:** distance, walking calories, BMR, TDEE, and calorie goals are approximate.
4. **No clinical guidance:** the app does not diagnose conditions or provide medical recommendations.
5. **Local storage:** uninstalling the app or clearing app data may remove locally stored history unless a future cloud backup/sync feature is added.

---

## Technical References

The following resources informed the step-tracking and native-development decisions:

- [Expo Pedometer documentation](https://docs.expo.dev/versions/v57.0.0/sdk/pedometer/)
- [Expo SDK reference](https://docs.expo.dev/versions/latest/)
- [Expo development builds](https://docs.expo.dev/develop/development-builds/)
- [Expo Notifications documentation](https://docs.expo.dev/versions/v57.0.0/sdk/notifications/)

---

## Git Workflow

```bash
git status
git diff
git add .
git commit -m "feat: describe your change"
git push origin main
```

---

## License

This project is released under the **MIT License**.

See [`LICENSE`](LICENSE) for details.

Third-party platform services, device APIs, and dependencies remain subject to their respective licenses and terms of use.

---

## Author

**FitPulse Development Team**

Mobile Engineering | Wellness UX | Sensor Integration | Local-First Application Design

FitPulse combines:

```text
React Native
+ Expo Router
+ TypeScript
+ Device Sensor Integration
+ Local Persistence
+ Personal Analytics
+ Habit-Building UX
```

---

## ⭐ Why this project matters

Fitness apps are most useful when they are honest about the data they can collect and simple enough to support daily consistency.

```text
Real Device Movement
      │
      ▼
Personal Goals
      │
      ▼
Clear Daily Progress
      │
      ▼
Food + Water + Weight Awareness
      │
      ▼
Small, Sustainable Habits
```

<p align="center">
  <strong>Move with intention. Track with clarity. Build healthier habits.</strong>
</p>
