import 'package:dio/dio.dart';
import 'package:flutter_secure_storage/flutter_secure_storage.dart';
import '../core/config.dart';

class ApiClient {
  ApiClient() {
    _dio = Dio(
      BaseOptions(
        baseUrl: AppConfig.apiBase,
        connectTimeout: const Duration(seconds: 20),
        receiveTimeout: const Duration(seconds: 60),
        headers: {'Content-Type': 'application/json', 'Accept': 'application/json'},
      ),
    );
    _dio.interceptors.add(
      InterceptorsWrapper(
        onRequest: (options, handler) async {
          final token = await _storage.read(key: 'bearer');
          if (token != null && token.isNotEmpty) {
            options.headers['Authorization'] = 'Bearer $token';
          }
          return handler.next(options);
        },
      ),
    );
  }

  late final Dio _dio;
  final _storage = const FlutterSecureStorage();

  Dio get dio => _dio;

  Future<void> saveBearerToken(String token) async {
    await _storage.write(key: 'bearer', value: token);
  }

  Future<String?> readBearerToken() => _storage.read(key: 'bearer');

  Future<void> clearSession() async {
    await _storage.delete(key: 'bearer');
    await _storage.delete(key: 'session');
  }

  Future<Response<dynamic>> post(
    String path, {
    Object? data,
    Map<String, dynamic>? query,
  }) {
    return _dio.post(path, data: data, queryParameters: query);
  }

  Future<Response<dynamic>> get(
    String path, {
    Map<String, dynamic>? query,
  }) {
    return _dio.get(path, queryParameters: query);
  }

  Future<Response<dynamic>> patch(String path, {Object? data}) {
    return _dio.patch(path, data: data);
  }

  Future<Response<dynamic>> delete(String path, {Object? data}) {
    return _dio.delete(path, data: data);
  }
}
