import 'package:dio/dio.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:socket_io_client/socket_io_client.dart' as io;
import '../core/config.dart';
import 'api_client.dart';

final apiClientProvider = Provider<ApiClient>((ref) => ApiClient());

final authStateProvider =
    StateNotifierProvider<AuthController, AuthState>((ref) {
  return AuthController(ref.watch(apiClientProvider));
});

class AuthState {
  const AuthState({this.userId, this.username, this.loading = false});
  final String? userId;
  final String? username;
  final bool loading;
  bool get isLoggedIn => userId != null;
}

class AuthController extends StateNotifier<AuthState> {
  AuthController(this._api) : super(const AuthState());
  final ApiClient _api;

  Future<String?> login(String username, String password) async {
    state = AuthState(
      userId: state.userId,
      username: state.username,
      loading: true,
    );
    try {
      final res = await _api.post(
        '/api/mobile/login',
        data: {
          'username': username.trim().toLowerCase(),
          'password': password,
        },
      );
      final token = res.data['token'] as String?;
      final user = res.data['user'] as Map?;
      if (token == null || token.isEmpty || user == null) {
        state = const AuthState();
        return 'invalid';
      }
      await _api.saveBearerToken(token);
      state = AuthState(
        userId: user['id']?.toString(),
        username: user['username']?.toString() ?? username,
      );
      return null;
    } on DioException catch (e) {
      state = const AuthState();
      if (e.type == DioExceptionType.connectionTimeout ||
          e.type == DioExceptionType.receiveTimeout ||
          e.type == DioExceptionType.connectionError) {
        return 'network';
      }
      if (e.response?.statusCode == 401) return 'invalid';
      return 'error';
    } catch (_) {
      state = const AuthState();
      return 'error';
    }
  }

  Future<void> logout() async {
    await _api.clearSession();
    state = const AuthState();
  }
}

class RealtimeService {
  io.Socket? _socket;

  Future<void> connect(ApiClient api) async {
    final tokenRes = await api.get('/api/realtime/token');
    final token = tokenRes.data['token'] as String;
    final url =
        (tokenRes.data['realtimeUrl'] as String?) ?? AppConfig.realtimeUrl;
    _socket?.dispose();
    _socket = io.io(
      url,
      io.OptionBuilder()
          .setTransports(['websocket'])
          .setAuth({'token': token})
          .enableAutoConnect()
          .build(),
    );
  }

  io.Socket? get socket => _socket;

  void joinConversation(String id) {
    _socket?.emit('conversation:join', {'conversationId': id});
  }

  void sendMessage(String conversationId, String body) {
    _socket?.emit('message:send', {
      'conversationId': conversationId,
      'body': body,
    });
  }

  void dispose() {
    _socket?.dispose();
    _socket = null;
  }
}

final realtimeProvider = Provider<RealtimeService>((ref) => RealtimeService());
