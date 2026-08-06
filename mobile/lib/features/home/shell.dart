import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:go_router/go_router.dart';

class AppShell extends StatelessWidget {
  const AppShell({super.key});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('appName'.tr())),
      body: ListView(
        padding: const EdgeInsets.all(20),
        children: [
          Text(
            'home'.tr(),
            style: Theme.of(context).textTheme.headlineMedium,
          ),
          const SizedBox(height: 16),
          _Tile(
            title: 'fromZero'.tr(),
            onTap: () => context.push('/start'),
          ),
          _Tile(
            title: 'progress'.tr(),
            onTap: () => context.push('/progress'),
          ),
          _Tile(
            title: 'messages'.tr(),
            onTap: () => context.push('/messages'),
          ),
          _Tile(
            title: 'profile'.tr(),
            onTap: () => context.push('/profile'),
          ),
        ],
      ),
    );
  }
}

class _Tile extends StatelessWidget {
  const _Tile({required this.title, required this.onTap});
  final String title;
  final VoidCallback onTap;

  @override
  Widget build(BuildContext context) {
    return Card(
      color: const Color(0xFF111C20),
      margin: const EdgeInsets.only(bottom: 10),
      child: ListTile(
        title: Text(title),
        trailing: const Icon(Icons.chevron_right),
        onTap: onTap,
      ),
    );
  }
}
