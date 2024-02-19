import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';
import './ui/home_page.dart';
import './app.dart' as app;

void main() async {
  WidgetsFlutterBinding.ensureInitialized();

  await app.init();
  runApp(const App());
}

class App extends StatefulWidget {
  const App({super.key});

  @override
  State<App> createState() => _AppState();
}

class _AppState extends State<App> {
  final GlobalKey<NavigatorState> navigatorKey = GlobalKey<NavigatorState>();

  @override
  Widget build(BuildContext context) {
    // https://pub.dev/packages/fluttertoast
    return MaterialApp(
      builder: FToastBuilder(),
      title: 'poexport',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.deepPurple),
        useMaterial3: true,
        fontFamily: 'Microsoft YaHei',
      ),
      home: const HomePage(),
      navigatorKey: navigatorKey,
    );
  }
}
