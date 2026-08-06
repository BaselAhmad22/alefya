import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/auth_realtime.dart';

class ExamPage extends ConsumerStatefulWidget {
  const ExamPage({
    super.key,
    required this.trackSlug,
    required this.stageSlug,
  });

  final String trackSlug;
  final String stageSlug;

  @override
  ConsumerState<ExamPage> createState() => _ExamPageState();
}

class _ExamPageState extends ConsumerState<ExamPage> {
  String? attemptId;
  List<dynamic> questions = [];
  final answers = <String, dynamic>{};
  bool loading = true;
  bool submitting = false;
  Map<String, dynamic>? result;

  @override
  void initState() {
    super.initState();
    _start();
  }

  Future<void> _start() async {
    setState(() {
      loading = true;
      result = null;
    });
    final api = ref.read(apiClientProvider);
    final res = await api.post('/api/exams', data: {
      'action': 'start',
      'trackSlug': widget.trackSlug,
      'stageSlug': widget.stageSlug,
      'locale': context.locale.languageCode,
    });
    if (!mounted) return;
    setState(() {
      loading = false;
      attemptId = res.data['attemptId'];
      questions = List.from(res.data['questions'] ?? []);
    });
  }

  Future<void> _submit() async {
    if (attemptId == null) return;
    setState(() => submitting = true);
    final api = ref.read(apiClientProvider);
    final res = await api.post('/api/exams', data: {
      'action': 'submit',
      'attemptId': attemptId,
      'locale': context.locale.languageCode,
      'answers': answers,
    });
    if (!mounted) return;
    setState(() {
      submitting = false;
      result = Map<String, dynamic>.from(res.data as Map);
    });
  }

  @override
  Widget build(BuildContext context) {
    if (loading || submitting) {
      return Scaffold(
        body: Center(
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              const CircularProgressIndicator(),
              const SizedBox(height: 16),
              Text(submitting ? 'analyzing'.tr() : 'exam'.tr()),
            ],
          ),
        ),
      );
    }

    if (result != null) {
      final report = result!['report'] as Map<String, dynamic>?;
      return Scaffold(
        appBar: AppBar(title: Text('exam'.tr())),
        body: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            Text(
              '${result!['score']}/100',
              style: Theme.of(context).textTheme.displaySmall,
            ),
            if (report != null) ...[
              const SizedBox(height: 12),
              Text(report['summary']?.toString() ?? ''),
              const SizedBox(height: 12),
              ...(report['items'] as List? ?? []).map((item) {
                final m = Map<String, dynamic>.from(item as Map);
                return Card(
                  child: ListTile(
                    title: Text(m['prompt']?.toString() ?? ''),
                    subtitle: Text(m['why']?.toString() ?? ''),
                  ),
                );
              }),
            ],
          ],
        ),
      );
    }

    return Scaffold(
      appBar: AppBar(title: Text('exam'.tr())),
      body: ListView.builder(
        padding: const EdgeInsets.all(16),
        itemCount: questions.length + 1,
        itemBuilder: (_, i) {
          if (i == questions.length) {
            return ElevatedButton(
              onPressed: _submit,
              child: Text('save'.tr()),
            );
          }
          final q = Map<String, dynamic>.from(questions[i] as Map);
          final id = q['id'] as String;
          final options = (q['options'] as List?)?.cast<String>();
          return Card(
            margin: const EdgeInsets.only(bottom: 12),
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(q['prompt']?.toString() ?? ''),
                  if (options != null)
                    ...List.generate(options.length, (oi) {
                      return RadioListTile<int>(
                        value: oi,
                        groupValue: answers[id] as int?,
                        title: Text(options[oi]),
                        onChanged: (v) => setState(() => answers[id] = v),
                      );
                    })
                  else
                    TextField(
                      onChanged: (v) => answers[id] = v,
                      maxLines: 4,
                      decoration: const InputDecoration(
                        border: OutlineInputBorder(),
                      ),
                    ),
                ],
              ),
            ),
          );
        },
      ),
    );
  }
}
