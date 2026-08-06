import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_markdown/flutter_markdown.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:share_plus/share_plus.dart';
import '../../core/config.dart';
import '../../data/auth_realtime.dart';

class LessonPage extends ConsumerStatefulWidget {
  const LessonPage({
    super.key,
    required this.trackSlug,
    required this.lessonSlug,
  });

  final String trackSlug;
  final String lessonSlug;

  @override
  ConsumerState<LessonPage> createState() => _LessonPageState();
}

class _LessonPageState extends ConsumerState<LessonPage> {
  int likes = 0;
  bool liked = false;
  final comments = <Map<String, dynamic>>[];
  final commentCtrl = TextEditingController();

  String get targetId => '${widget.trackSlug}:${widget.lessonSlug}';

  @override
  void initState() {
    super.initState();
    _loadSocial();
  }

  Future<void> _loadSocial() async {
    final api = ref.read(apiClientProvider);
    final likesRes = await api.get(
      '/api/social/likes',
      query: {'targetType': 'lesson', 'targetId': targetId},
    );
    final commentsRes = await api.get(
      '/api/social/comments',
      query: {'targetType': 'lesson', 'targetId': targetId},
    );
    if (!mounted) return;
    setState(() {
      likes = likesRes.data['count'] ?? 0;
      liked = likesRes.data['liked'] == true;
      comments
        ..clear()
        ..addAll(List<Map<String, dynamic>>.from(commentsRes.data['comments'] ?? []));
    });
  }

  Future<void> _toggleLike() async {
    final api = ref.read(apiClientProvider);
    if (liked) {
      await api.delete('/api/social/likes', data: {
        'targetType': 'lesson',
        'targetId': targetId,
      });
    } else {
      await api.post('/api/social/likes', data: {
        'targetType': 'lesson',
        'targetId': targetId,
      });
    }
    await _loadSocial();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.lessonSlug),
        actions: [
          IconButton(
            icon: const Icon(Icons.share_outlined),
            onPressed: () {
              final url =
                  '${AppConfig.apiBase}/ar/share/lesson/${widget.trackSlug}/${widget.lessonSlug}';
              Share.share(url);
            },
          ),
        ],
      ),
      body: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          MarkdownBody(
            data:
                '# ${widget.lessonSlug}\n\nOpen this lesson on the web for full markdown content, or wire `/api/content` later.',
          ),
          const SizedBox(height: 16),
          Row(
            children: [
              TextButton.icon(
                onPressed: _toggleLike,
                icon: Icon(liked ? Icons.favorite : Icons.favorite_border),
                label: Text('${'like'.tr()} $likes'),
              ),
            ],
          ),
          const Divider(),
          Text('comment'.tr(), style: Theme.of(context).textTheme.titleMedium),
          ...comments.map(
            (c) => ListTile(
              title: Text(c['body']?.toString() ?? ''),
              subtitle: Text('@${c['user']?['username'] ?? ''}'),
            ),
          ),
          TextField(
            controller: commentCtrl,
            decoration: InputDecoration(hintText: 'comment'.tr()),
            onSubmitted: (v) async {
              if (v.trim().isEmpty) return;
              await ref.read(apiClientProvider).post(
                '/api/social/comments',
                data: {
                  'targetType': 'lesson',
                  'targetId': targetId,
                  'body': v.trim(),
                },
              );
              commentCtrl.clear();
              await _loadSocial();
            },
          ),
        ],
      ),
    );
  }
}
