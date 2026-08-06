/// AlefYa mobile — shared API + realtime config.
class AppConfig {
  /// Point at your Next.js origin (no trailing slash).
  /// Android emulator → host machine: 10.0.2.2
  static const apiBase = String.fromEnvironment(
    'API_BASE',
    defaultValue: 'http://10.0.2.2:3000',
  );

  /// Socket.io realtime server.
  static const realtimeUrl = String.fromEnvironment(
    'REALTIME_URL',
    defaultValue: 'http://10.0.2.2:4001',
  );

  static const defaultLocale = 'ar';
}
