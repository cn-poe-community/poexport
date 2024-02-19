import 'package:flutter/material.dart';
import 'package:poexport/app.dart';
import 'package:poexport/ui/about_page.dart';
import 'package:poexport/ui/building_page.dart';
import 'package:poexport/ui/links_page.dart';
import 'package:poexport/ui/settings_page.dart';
import 'package:poexport/update.dart';
import 'package:version/version.dart';

class HomePage extends StatefulWidget {
  const HomePage({super.key});

  @override
  State<HomePage> createState() => _HomePageState();
}

class _HomePageState extends State<HomePage> {
  int _selectedIndex = 0;
  NavigationRailLabelType labelType = NavigationRailLabelType.all;
  double groupAlignment = -1.0;
  bool newVersionFound = false;

  @override
  void initState() {
    super.initState();
    () async {
      latest = await requestLatest();
      if (latest != null) {
        var currentV = Version.parse(packageInfo.version);
        var latestV = Version.parse(latest!.latest);

        if (currentV < latestV) {
          setState(() {
            newVersionFound = true;
          });
        }
      }
    }();
  }

  @override
  Widget build(BuildContext context) {
    Widget page;
    switch (_selectedIndex) {
      case 0:
        page = const BuildingPage();
        break;
      case 1:
        page = const LinksPage();
        break;
      case 2:
        page = const SettingsPage();
        break;
      case 3:
        page = const AboutPage();
        break;
      default:
        throw UnimplementedError('no widget for $_selectedIndex');
    }

    return Scaffold(
      body: Row(
        children: [
          NavigationRail(
            selectedIndex: _selectedIndex,
            groupAlignment: groupAlignment,
            onDestinationSelected: (int index) {
              setState(() {
                _selectedIndex = index;
              });
            },
            labelType: labelType,
            destinations: <NavigationRailDestination>[
              const NavigationRailDestination(
                icon: Icon(Icons.domain_outlined),
                selectedIcon: Icon(Icons.domain),
                label: Text('构建'),
              ),
              const NavigationRailDestination(
                icon: Icon(Icons.link_outlined),
                selectedIcon: Icon(Icons.link),
                label: Text('链接'),
              ),
              const NavigationRailDestination(
                icon: Icon(Icons.settings_outlined),
                selectedIcon: Icon(Icons.settings),
                label: Text('设置'),
              ),
              NavigationRailDestination(
                icon: newVersionFound
                    ? const Badge(
                        label: Text('1'),
                        child: Icon(Icons.info_outlined),
                      )
                    : const Icon(Icons.info_outlined),
                selectedIcon: newVersionFound
                    ? Badge(
                        label: newVersionFound ? const Text('1') : null,
                        child: const Icon(Icons.info),
                      )
                    : const Icon(Icons.info),
                label: const Text('关于'),
              ),
            ],
          ),
          const VerticalDivider(thickness: 1, width: 1),
          page
        ],
      ),
    );
  }
}
