import 'package:flutter/material.dart';
import 'package:url_launcher/url_launcher.dart';

final itemTranslationUrl = Uri.https("poe.pathof.top", "/item");
final dbQueryUrl = Uri.https("poe.pathof.top", "/query");

class LinksPage extends StatelessWidget {
  const LinksPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        children: [
          InkWell(
              child: const Text(
                '物品翻译',
                style: TextStyle(
                  height: 1.1,
                  decoration: TextDecoration.underline,
                ),
              ),
              onTap: () => launchUrl(itemTranslationUrl)),
          const SizedBox(
            height: 10,
          ),
          InkWell(
              child: const Text(
                '字典查询',
                style: TextStyle(
                  height: 1.1,
                  decoration: TextDecoration.underline,
                ),
              ),
              onTap: () => launchUrl(dbQueryUrl)),
        ],
      ),
    );
  }
}
