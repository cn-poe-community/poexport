import 'dart:convert';

import 'package:flutter/services.dart';
import 'package:flutter_js/flutter_js.dart';

abstract class Translator {
  Future<String> translateItems(String items);
  Future<String> translatePassiveSkills(String passiveSkills);
  Future<String> translateItemText(String item);
}

class JsTranslator extends Translator {
  String jsFile = "";

  @override
  Future<String> translateItems(String items) async {
    if (jsFile == "") {
      jsFile = await rootBundle.loadString("assets/js/translator.js");
    }

    final JavascriptRuntime jsRuntime = getJavascriptRuntime();

    var jsResult =
        jsRuntime.evaluate('${jsFile}Translator.translateItems($items);');
    return jsResult.stringResult;
  }

  @override
  Future<String> translatePassiveSkills(String passiveSkills) async {
    final JavascriptRuntime jsRuntime = getJavascriptRuntime();
    if (jsFile == "") {
      jsFile = await rootBundle.loadString("assets/js/translator.js");
    }

    var jsResult = jsRuntime.evaluate(
        '${jsFile}Translator.translatePassiveSkills($passiveSkills);');
    return jsResult.stringResult;
  }

  @override
  Future<String> translateItemText(String item) async {
    final JavascriptRuntime jsRuntime = getJavascriptRuntime();
    if (jsFile == "") {
      jsFile = await rootBundle.loadString("assets/js/translator.js");
    }

    var jsResult = jsRuntime
        .evaluate('${jsFile}Translator.translateItem(${jsonEncode(item)});');
    return jsResult.stringResult;
  }
}
