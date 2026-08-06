import 'package:easy_localization/easy_localization.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import '../../data/auth_realtime.dart';

class MessagesPage extends ConsumerStatefulWidget {
  const MessagesPage({super.key});

  @override
  ConsumerState<MessagesPage> createState() => _MessagesPageState();
}

class _MessagesPageState extends ConsumerState<MessagesPage> {
  List<dynamic> conversations = [];
  String? activeId;
  List<dynamic> messages = [];
  final textCtrl = TextEditingController();

  @override
  void initState() {
    super.initState();
    _boot();
  }

  Future<void> _boot() async {
    final api = ref.read(apiClientProvider);
    await ref.read(realtimeProvider).connect(api);
    final res = await api.post('/api/messages', data: {'action': 'list'});
    if (!mounted) return;
    setState(() => conversations = List.from(res.data['conversations'] ?? []));
  }

  Future<void> _open(String id) async {
    setState(() => activeId = id);
    ref.read(realtimeProvider).joinConversation(id);
    final res = await ref.read(apiClientProvider).post(
      '/api/messages',
      data: {'action': 'messages', 'conversationId': id},
    );
    if (!mounted) return;
    setState(() => messages = List.from(res.data['messages'] ?? []));
  }

  void _send() {
    final body = textCtrl.text.trim();
    if (body.isEmpty || activeId == null) return;
    ref.read(realtimeProvider).sendMessage(activeId!, body);
    textCtrl.clear();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: Text('messages'.tr())),
      body: Row(
        children: [
          SizedBox(
            width: 140,
            child: ListView(
              children: conversations.map((c) {
                final m = Map<String, dynamic>.from(c as Map);
                return ListTile(
                  dense: true,
                  selected: m['id'] == activeId,
                  title: Text(m['id'].toString().substring(0, 6)),
                  onTap: () => _open(m['id'] as String),
                );
              }).toList(),
            ),
          ),
          const VerticalDivider(width: 1),
          Expanded(
            child: Column(
              children: [
                Expanded(
                  child: ListView(
                    padding: const EdgeInsets.all(12),
                    children: messages.map((raw) {
                      final m = Map<String, dynamic>.from(raw as Map);
                      return Align(
                        alignment: Alignment.centerLeft,
                        child: Container(
                          margin: const EdgeInsets.only(bottom: 8),
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: const Color(0xFF111C20),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Text(m['body']?.toString() ?? ''),
                        ),
                      );
                    }).toList(),
                  ),
                ),
                Padding(
                  padding: const EdgeInsets.all(8),
                  child: Row(
                    children: [
                      Expanded(
                        child: TextField(
                          controller: textCtrl,
                          decoration: InputDecoration(
                            hintText: 'send'.tr(),
                          ),
                        ),
                      ),
                      IconButton(
                        onPressed: _send,
                        icon: const Icon(Icons.send),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }
}
