import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:go_router/go_router.dart';
import '../../data/auth_realtime.dart';

class LoginPage extends ConsumerStatefulWidget {
  const LoginPage({super.key});

  @override
  ConsumerState<LoginPage> createState() => _LoginPageState();
}

class _LoginPageState extends ConsumerState<LoginPage> {
  final userCtrl = TextEditingController();
  final passCtrl = TextEditingController();
  String? error;

  @override
  void dispose() {
    userCtrl.dispose();
    passCtrl.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    final err = await ref
        .read(authStateProvider.notifier)
        .login(userCtrl.text.trim(), passCtrl.text);
    if (!mounted) return;
    if (err != null) {
      setState(() {
        if (err == 'network') {
          error = 'Cannot reach server. Check Wi‑Fi / API IP.';
        } else if (err == 'invalid') {
          error = 'Invalid username or password';
        } else {
          error = 'error'.tr();
        }
      });
      return;
    }
    context.go('/home');
  }

  @override
  Widget build(BuildContext context) {
    final loading = ref.watch(authStateProvider).loading;
    return Scaffold(
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.stretch,
            children: [
              const Spacer(),
              Text(
                'appName'.tr(),
                style: Theme.of(context).textTheme.displaySmall?.copyWith(
                      color: const Color(0xFFD97706),
                      fontWeight: FontWeight.w700,
                    ),
              ),
              const SizedBox(height: 24),
              TextField(
                controller: userCtrl,
                decoration: InputDecoration(labelText: 'username'.tr()),
                textInputAction: TextInputAction.next,
              ),
              const SizedBox(height: 12),
              TextField(
                controller: passCtrl,
                obscureText: true,
                decoration: InputDecoration(labelText: 'password'.tr()),
                onSubmitted: (_) => _submit(),
              ),
              if (error != null) ...[
                const SizedBox(height: 12),
                Text(error!, style: const TextStyle(color: Colors.redAccent)),
              ],
              const SizedBox(height: 20),
              ElevatedButton(
                onPressed: loading ? null : _submit,
                child: loading
                    ? const SizedBox(
                        height: 22,
                        width: 22,
                        child: CircularProgressIndicator(strokeWidth: 2),
                      )
                    : Text('login'.tr()),
              ),
              const Spacer(),
            ],
          ),
        ),
      ),
    );
  }
}
