# FitPulse - Professional Fitness, Calorie & Step Tracker

FitPulse is a local-first React Native fitness app built with Expo SDK 57, TypeScript and Expo Router. It prioritizes real device pedometer data, calorie tracking, water, weight and useful analytics.

## Important step-tracking reality

The implementation deliberately does **not** fake steps.

Expo's `expo-sensors` Pedometer API provides real device sensor data, but its subscription does **not** deliver pedometer updates while the app is in the background. On iOS, `Pedometer.getStepCountAsync(start, end)` can retrieve historical counts. On Android, Expo's own documentation recommends Health Connect as an alternative for background/history access.

Therefore this project implements:

- Real `Pedometer.watchStepCount()` data while the app is active.
- Android `ACTIVITY_RECOGNITION` permission handling.
- iOS motion permission handling through the Pedometer API.
- Persistent daily totals so app restarts do not erase previously observed steps.
- iOS historical reconciliation when supported.
- Explicit "foreground sensor tracking" status instead of pretending background tracking works.
- A clean `StepProvider` service boundary so a future Android Health Connect adapter can be added without rewriting the UI/store.

**There is no fake/mock step incrementer in the production code.**

## Expo Go vs development build

Expo SDK 57 is the current stable SDK referenced by the Expo documentation at the time this project was generated.

For quick UI development:

```bash
npm install
npx expo start
```

For production-oriented testing and native configuration:

```bash
npx expo install
npx expo run:android
```

or use EAS development builds.

Expo Go can load the Pedometer module, but it cannot turn Expo's Pedometer subscription into a true background step collector. A development build does not change that limitation by itself; true Android background/history collection should use a Health Connect integration.

Local notifications are implemented. Remote push notifications are not needed for this personal app.

## Install

Requirements:

- Node.js compatible with Expo SDK 57 (Expo currently documents Node.js 22.13.x as the SDK 57 minimum).
- Android Studio for local Android builds, or EAS Build.
- A physical Android/iOS device for meaningful pedometer testing.

```bash
npm install
npx expo start
```

TypeScript check:

```bash
npm run typecheck
```

Android native build:

```bash
npx expo run:android
```

## First-run flow

1. Open Profile and enter age, height, weight and goals.
2. Open Steps.
3. Grant activity/motion permission.
4. Keep FitPulse active while validating sensor readings.
5. Set notification preferences if desired.

## Architecture

```text
app/
  (tabs)/
    index.tsx
    steps.tsx
    calories.tsx
    water.tsx
    weight.tsx
    statistics.tsx
    profile.tsx
    settings.tsx
  add-food.tsx
  _layout.tsx

components/
  ui.tsx
  ProgressRing.tsx
  MiniChart.tsx

features/
  dashboard/
  steps/
  calories/
  water/
  weight/
  statistics/

services/
  storage.ts
  pedometer.ts
  notifications.ts
  calories.ts

store/
  FitnessProvider.tsx

hooks/
  useFitness.ts
  usePedometer.ts

constants/
  theme.ts

types/
  fitness.ts

utils/
  date.ts
  format.ts
```

## Data model

All personal data is stored locally with AsyncStorage:

- Profile
- Goals
- Daily step totals
- Food logs
- Water logs
- Weight entries
- Notification settings
- App preferences

The service/store boundary is intentionally backend-ready. A future Firebase/Supabase/API layer can replace the storage implementation without changing the screen components.

## Calorie formulas

BMR uses Mifflin-St Jeor:

Male:

`BMR = 10W + 6.25H - 5A + 5`

Female:

`BMR = 10W + 6.25H - 5A - 161`

TDEE = BMR × activity multiplier.

The default calorie goal is derived from TDEE and the selected weight goal, but the user can override it.

## Walking estimates

Distance is estimated from steps using a configurable stride approximation. Walking calories are estimated from body weight, distance and a conservative walking MET. These are estimates, not medical measurements.

## Notifications

Local notifications include:

- Water reminder
- Meal reminder
- Step-goal reminder
- Weight check reminder
- Inactivity reminder

They are scheduled only when enabled and can be disabled individually.

## Production checklist

Before publishing:

- Test pedometer behavior on several physical Android devices and iPhones.
- Add an Android Health Connect integration if true background/history step collection is a hard requirement.
- Test Android battery optimization/device-vendor restrictions.
- Add app icon/splash assets.
- Configure EAS project ID and production credentials.
- Add privacy policy and store disclosures for activity data.
- Run `npm run typecheck`.
- Build a release binary and test permissions/notifications again.

## Sources used for the technical decision

Expo Pedometer documentation:
https://docs.expo.dev/versions/v57.0.0/sdk/pedometer/

Expo SDK reference:
https://docs.expo.dev/versions/latest/

Expo development builds:
https://docs.expo.dev/develop/development-builds/

Expo notifications:
https://docs.expo.dev/versions/v57.0.0/sdk/notifications/

```
FitPulse-Professional-Fitness-Tracker
├─ app
│  ├─ (tabs)
│  │  ├─ calories.tsx
│  │  ├─ index.tsx
│  │  ├─ profile.tsx
│  │  ├─ settings.tsx
│  │  ├─ statistics.tsx
│  │  ├─ steps.tsx
│  │  ├─ water.tsx
│  │  ├─ weight.tsx
│  │  └─ _layout.tsx
│  ├─ add-food.tsx
│  ├─ settings.tsx
│  └─ _layout.tsx
├─ app.json
├─ assets
│  └─ README.md
├─ components
│  ├─ MiniChart.tsx
│  ├─ ProgressRing.tsx
│  └─ ui.tsx
├─ constants
│  └─ theme.ts
├─ eslint.config.js
├─ expo-env.d.ts
├─ hooks
│  ├─ useFitness.ts
│  └─ usePedometer.ts
├─ package.json
├─ README.md
├─ services
│  ├─ calories.ts
│  ├─ notifications.ts
│  ├─ pedometer.ts
│  └─ storage.ts
├─ store
│  └─ FitnessProvider.tsx
├─ tsconfig.json
├─ types
│  └─ fitness.ts
└─ utils
   ├─ calorie.test.ts
   ├─ date.ts
   └─ format.ts

```
