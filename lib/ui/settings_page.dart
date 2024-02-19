import 'package:flutter/material.dart';
import 'package:poexport/app.dart';

class SettingsPage extends StatefulWidget {
  const SettingsPage({super.key});

  @override
  State<StatefulWidget> createState() => _SettingPageState();
}

class _SettingPageState extends State<SettingsPage> {
  var poeSessId = configManager.config.poeSessId;

  final TextEditingController _poeSessIdInputController =
      TextEditingController(text: configManager.config.poeSessId);

  @override
  void initState() {
    super.initState();
  }

  @override
  void dispose() {
    _poeSessIdInputController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Row(
            children: [
              Text('POESESSID'),
            ],
          ),
          const SizedBox(
            height: 10,
          ),
          Row(
            children: [
              SizedBox(
                width: 260,
                child: TextField(
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    enabledBorder: OutlineInputBorder(),
                    focusedBorder: OutlineInputBorder(),
                    isDense: true,
                    contentPadding:
                        EdgeInsets.symmetric(vertical: 12, horizontal: 10),
                  ),
                  style: const TextStyle(fontSize: 12.0, height: 1.1),
                  onChanged: ((value) {
                    setState(() {
                      poeSessId = value;
                    });
                  }),
                  controller: _poeSessIdInputController,
                ),
              ),
              const SizedBox(
                width: 10,
              ),
              SizedBox(
                height: 30,
                child: TextButton(
                  style: ButtonStyle(
                    shape:
                        MaterialStateProperty.all(const RoundedRectangleBorder(
                      borderRadius: BorderRadius.all(Radius.circular(5.0)),
                      side:
                          BorderSide(color: Color.fromARGB(255, 150, 150, 150)),
                    )),
                  ),
                  onPressed: poeSessId == "" ||
                          poeSessId == configManager.config.poeSessId
                      ? null
                      : () async {
                          await updatePoeSessId(poeSessId);
                        },
                  child: Text(
                    '保存',
                    style: TextStyle(
                      fontSize: 14.0,
                      color: poeSessId == "" ||
                              poeSessId == configManager.config.poeSessId
                          ? Colors.black26
                          : Colors.black,
                    ),
                  ),
                ),
              ),
            ],
          )
        ],
      ),
    );
  }
}
