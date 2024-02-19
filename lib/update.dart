import 'dart:convert';
import 'package:http/http.dart' as http;

class Latest {
  String latest;
  String changelog;

  Latest(this.latest, this.changelog);

  Latest.fromMap(Map<String, dynamic> json)
      : latest = json["latest"],
        changelog = json["changelog"];

  factory Latest.fromJson(String json) {
    Map<String, dynamic> map = jsonDecode(json);
    return Latest.fromMap(map);
  }
}

final links = [
  "http://42.193.7.36:8888/api/version/export",
  "https://poe.pathof.top/api/version/export",
];

Future<Latest?> _requestLatest(String link) async {
  var url = Uri.parse(link);
  var response = await http.get(url);
  if (response.statusCode == 200) {
    return Latest.fromJson(response.body);
  }
  return null;
}

Future<Latest?> requestLatest() async {
  for (var link in links) {
    var latest = await _requestLatest(link);
    if (latest != null) {
      return latest;
    }
  }
  return null;
}
