# AlefYa Mobile (Flutter)

Android + iOS client for the AlefYa platform. Shares the same Next.js REST APIs and Socket.io realtime server.

## Prerequisites

1. Install [Flutter](https://docs.flutter.dev/get-started/install)
2. Run the web API: `npm run dev` from the repo root (web on `:3000`, realtime on `:4001`)
3. For Android emulator, `10.0.2.2` maps to the host machine (already the default in `lib/core/config.dart`)

## Run

```bash
cd mobile
flutter pub get
flutter run
```

Custom hosts:

```bash
flutter run --dart-define=API_BASE=http://192.168.1.10:3000 --dart-define=REALTIME_URL=http://192.168.1.10:4001
```

## Architecture

- `lib/data` — Dio API client + Auth.js cookie session + Socket.io
- `lib/features` — Login, home shell, lesson social, exam+AI report, messages, profile
- `assets/i18n` — AR/EN via easy_localization
- Theme mirrors AlefYa dark teal/accent tokens

## Auth note

Mobile login uses Auth.js credentials callback + session cookie storage in `flutter_secure_storage`. Ensure `AUTH_URL` / CORS allow your device origin in production, or add a dedicated mobile token endpoint later.
