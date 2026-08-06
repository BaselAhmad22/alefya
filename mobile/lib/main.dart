import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import 'core/theme.dart';
import 'data/auth_realtime.dart';
import 'features/auth/login_page.dart';
import 'features/home/shell.dart';
import 'features/lesson/lesson_page.dart';
import 'features/exam/exam_page.dart';
import 'features/messages/messages_page.dart';
import 'features/profile/profile_page.dart';
import 'features/progress/progress_page.dart';
import 'features/start/start_page.dart';

Future<void> main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await EasyLocalization.ensureInitialized();
  runApp(
    EasyLocalization(
      supportedLocales: const [Locale('ar'), Locale('en')],
      path: 'assets/i18n',
      fallbackLocale: const Locale('ar'),
      child: const ProviderScope(child: AlefYaApp()),
    ),
  );
}

class AlefYaApp extends ConsumerWidget {
  const AlefYaApp({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authStateProvider);
    final router = GoRouter(
      initialLocation: auth.isLoggedIn ? '/home' : '/login',
      routes: [
        GoRoute(path: '/login', builder: (_, __) => const LoginPage()),
        GoRoute(path: '/home', builder: (_, __) => const AppShell()),
        GoRoute(path: '/progress', builder: (_, __) => const ProgressPage()),
        GoRoute(path: '/start', builder: (_, __) => const StartPage()),
        GoRoute(path: '/profile', builder: (_, __) => const ProfilePage()),
        GoRoute(path: '/messages', builder: (_, __) => const MessagesPage()),
        GoRoute(
          path: '/learn/:track/:lesson',
          builder: (_, state) => LessonPage(
            trackSlug: state.pathParameters['track']!,
            lessonSlug: state.pathParameters['lesson']!,
          ),
        ),
        GoRoute(
          path: '/exam/:track/:stage',
          builder: (_, state) => ExamPage(
            trackSlug: state.pathParameters['track']!,
            stageSlug: state.pathParameters['stage']!,
          ),
        ),
      ],
    );

    return MaterialApp.router(
      title: 'appName'.tr(),
      debugShowCheckedModeBanner: false,
      theme: AlefYaTheme.dark,
      locale: context.locale,
      supportedLocales: context.supportedLocales,
      localizationsDelegates: context.localizationDelegates,
      routerConfig: router,
    );
  }
}
