import 'dart:io';

import 'package:flutter/foundation.dart';
import 'package:logger/logger.dart';
import 'package:path/path.dart' as path;

Future<Logger> logger() async {
  final logDir = path.join(path.dirname(Platform.resolvedExecutable), "logs");
  await Directory(logDir).create();
  final logFile = File(path.join(logDir, _logFileName()));

  return Logger(
    printer: _ClassicalPrinter(),
    output: _FileOutput(logFile),
    level: kDebugMode ? Level.all : Level.info,
  );
}

String _logFileName() {
  final now = DateTime.now();
  return '${now.year}-${now.month}-${now.day}.log';
}

class _FileOutput extends LogOutput {
  final File _file;

  _FileOutput(File file) : _file = file;

  @override
  void output(OutputEvent event) {
    _file.writeAsStringSync(
        event.lines.join(Platform.lineTerminator) + Platform.lineTerminator,
        mode: FileMode.writeOnlyAppend);
  }
}

class _ClassicalPrinter extends LogPrinter {
  @override
  List<String> log(LogEvent event) {
    var text = <String>[];
    if (event.error != null && event.stackTrace != null) {
      text.add("${event.stackTrace}");
    }
    text.add(
        "[${DateTime.now()}][${_prettyLevel(event.level)}] ${event.message}");
    return text;
  }

  String _prettyLevel(Level level) {
    return switch (level) {
      Level.all => "ALL",
      Level.debug => "DEBUG",
      Level.error => "ERROR",
      Level.fatal => "FATAL",
      Level.info => "INFO",
      Level.off => "OFF",
      Level.trace => "TRACE",
      Level.warning => "WARNING",
      _ => "Deprecated Level",
    };
  }
}
