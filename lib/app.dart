import 'dart:io';
import 'dart:ui';
import 'package:logger/logger.dart';
import 'package:package_info_plus/package_info_plus.dart';
import 'package:path/path.dart' as path;
import 'package:poexport/update.dart';
import 'poe/creator.dart';
import './log.dart' as log;
import './conf.dart';
import './poe/api.dart';
import 'poe/translator.dart';
import 'package:window_size/window_size.dart' as window_size;

late final Logger logger;
late final ConfigManager configManager;
late final Requester requester;

final Creator creator = JsCreator();
final Translator translator = JsTranslator();

late final PackageInfo packageInfo;
Latest? latest;

Future<void> init() async {
  logger = await log.logger();

  await _initConfig();

  requester = Requester(configManager.config.poeSessId);

  packageInfo = await PackageInfo.fromPlatform();

  final screen = await window_size.getCurrentScreen();
  if (screen != null) {
    //TODO: test on Windows which version lower than Windows10 1809
    final scaleFactor = screen.scaleFactor;
    window_size.setWindowMinSize(Size(500 * scaleFactor, 500 * scaleFactor));
  }
}

Future<void> _initConfig() async {
  configManager = ConfigManager();

  if (Platform.isWindows) {
    var localAppData = Platform.environment["LOCALAPPDATA"];
    var configPath = path.join(localAppData!, "poexport", "config.json");
    await configManager.load(configPath);
  }
}

Future<void> updatePoeSessId(String poeSessId) async {
  configManager.config.poeSessId = poeSessId;
  await configManager.save();
  requester.poeSessId = poeSessId;
}
