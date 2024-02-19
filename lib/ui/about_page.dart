import 'package:flutter/material.dart';
import 'package:poexport/app.dart';
import 'package:url_launcher/url_launcher.dart';

final githubDownloadPageUrl =
    Uri.https("www.github.com", "/cn-poe-community/poexport");
final panDownloadPageUrl = Uri.https("www.lanzout.com", "/b02vcj9hg");

class AboutPage extends StatelessWidget {
  const AboutPage({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              const Text("当前版本"),
              const SizedBox(
                width: 30,
              ),
              Text(packageInfo.version),
            ],
          ),
          const SizedBox(
            height: 5,
          ),
          Row(
            children: [
              const Text("最新版本"),
              const SizedBox(
                width: 30,
              ),
              Text(latest != null ? latest!.latest : "检查更新失败"),
            ],
          ),
          const SizedBox(
            height: 5,
          ),
          Row(
            children: [
              const Text("下载地址"),
              const SizedBox(
                width: 30,
              ),
              InkWell(
                  child: const Text(
                    "github",
                    style: TextStyle(
                      height: 1.1,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                  onTap: () => launchUrl(githubDownloadPageUrl)),
              const SizedBox(
                width: 10,
              ),
              InkWell(
                  child: const Text(
                    "网盘（密码1234）",
                    style: TextStyle(
                      height: 1.1,
                      decoration: TextDecoration.underline,
                    ),
                  ),
                  onTap: () => launchUrl(panDownloadPageUrl)),
            ],
          ),
        ],
      ),
    );
  }
}
