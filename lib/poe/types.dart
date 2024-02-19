import 'dart:convert';

/// RequestException includes any request error returned by server.
class RequestException implements Exception {
  final String? message;
  final int? statusCode;

  const RequestException([this.message, this.statusCode]);

  @override
  String toString() {
    return "$message";
  }
}

class Profile {
  String uuid;
  String name;
  String realm;
  String locale;

  Profile(this.uuid, this.name, this.realm, this.locale);

  Profile.fromMap(Map<String, dynamic> json)
      : uuid = json["uuid"],
        name = json["name"],
        realm = json["realm"],
        locale = json["locale"];

  factory Profile.fromJson(String json) {
    Map<String, dynamic> map = jsonDecode(json);
    return Profile.fromMap(map);
  }
}

class Character {
  String className;
  String league;
  int level;
  String name;
  String realm;

  Character(this.className, this.league, this.level, this.name, this.realm);

  Character.fromMap(Map<String, dynamic> json)
      : className = json["class"],
        league = json["league"],
        level = json["level"],
        name = json["name"],
        realm = json["realm"];

  factory Character.fromJson(String json) {
    Map<String, dynamic> map = jsonDecode(json);
    return Character.fromMap(map);
  }
}
