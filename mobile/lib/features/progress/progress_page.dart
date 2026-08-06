import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/auth_realtime.dart';

class ProgressPage extends ConsumerStatefulWidget {
  const ProgressPage({super.key});

  @override
  ConsumerState<ProgressPage> createState() => _ProgressPageState();
}

class _ProgressPageState extends ConsumerState<ProgressPage> {
  // Dashboard HTML is SSR — mobile uses tracks enrollment via classmates pattern.
  // For v1 we deep-link users to web-parity routes after login session works.
  final items = <Map<String, String>>[];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('progress'.tr())),
      body: items.isEmpty
          ? Center(child: Text('empty'.tr()))
          : ListView.builder(
              itemCount: items.length,
              itemBuilder: (_, i) {
                final item = items[i];
                return ListTile(
                  title: Text(item['title'] ?? ''),
                  onTap: () => context.push(item['href']!),
                );
              },
            ),
      floatingActionButton: FloatingActionButton.extended(
        onPressed: () => context.push('/start'),
        label: Text('fromZero'.tr()),
      ),
    );
  }
}

class StartPage extends StatelessWidget {
  const StartPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('fromZero'.tr())),
      body: Padding(
        padding: const EdgeInsets.all(20),
        child: Text(
          'Level is asked once on web and saved to your account. '
          'Open Profile to change it. Continue field → language → framework on the website wizard API (/api/roadmap).',
          style: Theme.of(context).textTheme.bodyLarge,
        ),
      ),
    );
  }
}

class ProfilePage extends ConsumerWidget {
  const ProfilePage({super.key});

  @override
  Widget build(BuildContext context, WidgetRef ref) {
    final auth = ref.watch(authStateProvider);
    return Scaffold(
      appBar: AppBar(title: Text('profile'.tr())),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text('@${auth.username ?? ''}'),
          const SizedBox(height: 16),
          ListTile(
            title: Text('changePassword'.tr()),
            subtitle: const Text('Uses PATCH /api/profile'),
          ),
          ListTile(
            title: Text('level'.tr()),
            subtitle: const Text('PATCH /api/profile { level }'),
          ),
          const SizedBox(height: 24),
          ElevatedButton(
            onPressed: () async {
              await ref.read(authStateProvider.notifier).logout();
              if (context.mounted) context.go('/login');
            },
            child: Text('logout'.tr()),
          ),
        ],
      ),
    );
  }
}
