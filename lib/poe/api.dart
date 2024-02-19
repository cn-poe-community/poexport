import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

import './types.dart';

const txPoeHost = "poe.game.qq.com";
const profilePath = "/api/profile";
const getCharactersPath = "/character-window/get-characters";
const getPassiveSkillsPath = "/character-window/get-passive-skills";
const getItemsPath = "/character-window/get-items";

var _profileUri = Uri.https(txPoeHost, profilePath);
var _getCharactersUri = Uri.https(txPoeHost, getCharactersPath);
var _getPassiveSkillsUri = Uri.https(txPoeHost, getPassiveSkillsPath);
var _getItemsUri = Uri.https(txPoeHost, getItemsPath);

/// The POE api-requested [http.Client].
///
/// Request with POESESSID and disable redirect.
class _PoeClient extends http.BaseClient {
  final String _poeSessId;
  final _inner = http.Client();

  _PoeClient(this._poeSessId);

  @override
  Future<http.StreamedResponse> send(http.BaseRequest request) {
    request.headers["Cookie"] = "POESESSID=$_poeSessId";
    //TODO: fix redirect disabled does not work
    request.followRedirects = false;

    return _inner.send(request);
  }

  @override
  void close() {
    _inner.close();
  }
}

class Requester {
  _PoeClient _client;

  set poeSessId(String poeSessId) {
    _client.close();
    _client = _PoeClient(poeSessId);
  }

  Requester(String poeSessId) : _client = _PoeClient(poeSessId);

  /// Request profile data.
  ///
  /// throws [http.ClientException] when a network error occurs.
  /// throws [RequestException] when a server error is received.
  Future<Profile> profile() async {
    var resp = await _client.get(_profileUri);

    var respBody = utf8.decode(resp.bodyBytes);

    if (resp.statusCode == HttpStatus.ok) {
      var profile = Profile.fromJson(respBody);
      return profile;
    } else {
      throw _requestExceptionOf(resp);
    }
  }

  RequestException _requestExceptionOf(http.Response resp) {
    var message = switch (resp.statusCode) {
      401 => "POESESSID已失效，请更新",
      403 => "你查看的用户不存在或已隐藏",
      429 => "请求过于频繁，请稍等 ${_rateLimit(resp.headers)} 再试",
      _ => "未预期的HTTP错误: ${resp.statusCode}",
    };

    return RequestException(message, resp.statusCode);
  }

  String _rateLimit(Map<String, String> headers) {
    var maxLimited = 0; // in seconds

    var exp = RegExp(r"^x-rate-limit-.+-state$");
    for (var entry in headers.entries) {
      if (exp.hasMatch(entry.key)) {
        var states = entry.value.split(",");
        var limits = states.map((e) {
          var pieces = e.split(":");
          return int.parse(pieces.last);
        });

        var theMax = limits
            .reduce((value, element) => value > element ? value : element);

        if (theMax > maxLimited) {
          maxLimited = theMax;
        }
      }
    }

    if (maxLimited > 3600) {
      var h = maxLimited ~/ 3600;
      var m = (maxLimited % 3600) ~/ 60;
      var s = maxLimited % 60;
      return "$h小时$m分钟$s秒";
    }
    if (maxLimited > 60) {
      var m = (maxLimited % 3600) ~/ 60;
      var s = maxLimited % 60;
      return "$m分钟$s秒";
    }

    return "$maxLimited秒";
  }

  /// Get characters data of an account.
  ///
  /// Throw [http.ClientException] when a network error occurs.
  ///
  /// Throw [RequestException] when a server error is received.
  Future<List<Character>> getCharacters(
      String accountName, String realm) async {
    var formData = <String, dynamic>{};
    formData["accountName"] = accountName;
    formData["realm"] = realm;

    // throw [http.ClientException] when a network error occurs
    var resp = await _client.post(_getCharactersUri, body: formData);
    var respBody = utf8.decode(resp.bodyBytes);

    if (resp.statusCode == HttpStatus.ok) {
      List<dynamic> data = jsonDecode(respBody);
      List<Character> characters = [];
      for (Map<String, dynamic> item in data) {
        characters.add(Character.fromMap(item));
      }
      return characters;
    } else {
      throw _requestExceptionOf(resp);
    }
  }

  /// Get passive skills json of a character.
  ///
  /// Throw [http.ClientException] when a network error occurs.
  ///
  /// Throw [RequestException] when a server error is received.
  Future<String> getPassiveSkills(
      String accountName, String character, String realm) async {
    var formData = <String, dynamic>{};
    formData["accountName"] = accountName;
    formData["character"] = character;
    formData["realm"] = realm;

    var resp = await _client.post(_getPassiveSkillsUri, body: formData);
    var respBody = utf8.decode(resp.bodyBytes);

    if (resp.statusCode == HttpStatus.ok) {
      return respBody;
    } else {
      throw _requestExceptionOf(resp);
    }
  }

  /// Get items json of a character.
  ///
  /// Throw [http.ClientException] when a network error occurs.
  ///
  /// Throw [RequestException] when a server error is received.
  Future<String> getItems(
      String accountName, String character, String realm) async {
    var formData = <String, dynamic>{};
    formData["accountName"] = accountName;
    formData["character"] = character;
    formData["realm"] = realm;

    http.Response resp = await _client.post(_getItemsUri, body: formData);
    var respBody = utf8.decode(resp.bodyBytes);

    if (resp.statusCode == HttpStatus.ok) {
      return respBody;
    } else {
      throw _requestExceptionOf(resp);
    }
  }
}
