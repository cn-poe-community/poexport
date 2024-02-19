import 'package:flutter/services.dart';
import 'package:flutter_js/flutter_js.dart';

abstract class Creator {
  Future<String> createBuilding(String items, String passiveSkills);
}

class JsCreator extends Creator {
  String jsFile = "";

  @override
  Future<String> createBuilding(String items, String passiveSkills) async {
    final JavascriptRuntime jsRuntime = getJavascriptRuntime();
    if (jsFile == "") {
      jsFile = await rootBundle.loadString("assets/js/creator.js");
    }

    var jsResult =
        jsRuntime.evaluate('${jsFile}Creator.create($items, $passiveSkills);');
    return jsResult.stringResult;
  }
}
