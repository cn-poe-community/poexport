import 'dart:convert';
import 'dart:io';

/// App config.
class Config {
  var poeSessId = "";

  Config();

  Config.fromMap(Map<String, dynamic> map) : poeSessId = map["poeSessId"];

  factory Config.fromJson(String json) {
    Map<String, dynamic> map = jsonDecode(json);
    return Config.fromMap(map);
  }

  String toJson() {
    var data = {
      "poeSessId": poeSessId,
    };

    const encoder = JsonEncoder.withIndent("  ");
    return encoder.convert(data);
  }

  @override
  String toString() {
    return toJson();
  }
}

/// ConfigManager is used to load or save config.
///
/// User should call load() to init config.
///
/// User should call save() to write config to disk if the settings is changed finally.
class ConfigManager {
  late Config config;
  late File _configFile;

  /// Load settings from application data floor.
  Future<void> load(String filename) async {
    _configFile = File(filename);
    if (await _configFile.exists()) {
      var json = await _configFile.readAsString();
      config = Config.fromJson(json);
    } else {
      config = Config();
      save();
    }
  }

  /// Save settings to disk.
  Future<void> save() async {
    await _configFile.writeAsString(config.toJson());
  }
}
