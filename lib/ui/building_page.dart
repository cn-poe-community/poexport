import 'dart:convert';
import 'dart:core';
import 'dart:io';

import 'package:dropdown_button2/dropdown_button2.dart';
import 'package:flutter/material.dart';
import 'package:flutter/services.dart';
import 'package:fluttertoast/fluttertoast.dart';
import 'package:poexport/app.dart';
import 'package:poexport/poe/types.dart';
import 'package:poexport/ui/widgets/toast.dart';

class BuildingPage extends StatefulWidget {
  const BuildingPage({super.key});

  @override
  State<BuildingPage> createState() => _BuildingPageState();
}

class _BuildingPageState extends State<BuildingPage> {
  late FToast fToast;

  late TextEditingController _accountInputController;

  var accountName = "";
  List<String> leagues = [];
  List<String> shownCharacterNames = [];
  String? selectedLeague = "";
  String? selectedCharacterName = "";
  String code = "";

  Map<String, List<String>> leagueMap = {}; //league name maps to characters

  @override
  void initState() {
    super.initState();
    fToast = FToast();
    fToast.init(context);
    _accountInputController = TextEditingController();
  }

  @override
  void dispose() {
    _accountInputController.dispose();
    super.dispose();
  }

  Future<void> readButtonHandler() async {
    setState(() {
      leagues = [];
      shownCharacterNames = [];
      selectedLeague = "";
      selectedCharacterName = "";
    });
    leagueMap = {};

    List<Character> characters = [];
    try {
      characters = await requester.getCharacters(accountName, "pc");
    } on Exception catch (e) {
      showErrToast(fToast, e.toString());
      return;
    }
    if (characters.isNotEmpty) {
      leagueMap = {};
      for (var character in characters) {
        var league = character.league;
        if (leagueMap.containsKey(league)) {
          leagueMap[league]!.add(character.name);
        } else {
          leagueMap[league] = [character.name];
        }
      }
      setState(() {
        leagues = List.from(leagueMap.keys);
        selectedLeague = leagues.first;
        shownCharacterNames = leagueMap[selectedLeague]!;
        selectedCharacterName = shownCharacterNames.first;
      });
    }
  }

  Future<void> exportButtonHandler() async {
    setState(() {
      code = "";
    });

    String items;
    String passiveSkills;
    try {
      items =
          await requester.getItems(accountName, selectedCharacterName!, "pc");
      passiveSkills = await requester.getPassiveSkills(
          accountName, selectedCharacterName!, "pc");
    } on Exception catch (e) {
      showErrToast(fToast, e.toString());
      return;
    }

    items = await translator.translateItems(items);
    passiveSkills = await translator.translatePassiveSkills(passiveSkills);
    var building = await creator.createBuilding(items, passiveSkills);
    setState(() {
      code = _encode(building);
    });
  }

  Future<void> copyButtonHandler() async {
    await Clipboard.setData(ClipboardData(text: code));
    showToast(fToast, "已复制");
  }

  String _encode(String building) {
    var compressed = ZLibCodec().encode(utf8.encode(building));
    return base64Encode(compressed).replaceAll("+", "-").replaceAll("/", "_");
  }

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              SizedBox(
                width: 220,
                child: TextField(
                  decoration: const InputDecoration(
                    border: OutlineInputBorder(),
                    enabledBorder: OutlineInputBorder(),
                    focusedBorder: OutlineInputBorder(),
                    hintText: '论坛账户名',
                    isDense: true,
                    contentPadding:
                        EdgeInsets.symmetric(vertical: 12, horizontal: 10),
                  ),
                  style: const TextStyle(fontSize: 14.0, height: 1.1),
                  onChanged: ((value) {
                    setState(() {
                      accountName = value;
                    });
                  }),
                ),
              ),
              const SizedBox(
                width: 85,
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
                  onPressed: accountName == "" ? null : readButtonHandler,
                  child: Text(
                    '读取',
                    style: TextStyle(
                      fontSize: 14.0,
                      color: accountName == "" ? Colors.black26 : Colors.black,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(
            height: 10,
          ),
          Row(
            children: [
              DropdownButtonHideUnderline(
                child: DropdownButton2<String>(
                  hint: Text(
                    '选择赛季',
                    style: TextStyle(
                      fontSize: 14,
                      color: Theme.of(context).hintColor,
                    ),
                  ),
                  items: leagues
                      .map((String item) => DropdownMenuItem<String>(
                            value: item,
                            child: Text(
                              item,
                              style: const TextStyle(
                                fontSize: 14,
                              ),
                            ),
                          ))
                      .toList(),
                  value: selectedLeague,
                  onChanged: (String? value) {
                    if (value == selectedLeague) {
                      return;
                    }
                    setState(() {
                      selectedLeague = value!;
                      shownCharacterNames = leagueMap[selectedLeague]!;
                      selectedCharacterName = shownCharacterNames.first;
                    });
                  },
                  buttonStyleData: ButtonStyleData(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      height: 32,
                      width: 220,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.black54),
                        borderRadius:
                            const BorderRadius.all(Radius.circular(4.0)),
                      )),
                ),
              ),
            ],
          ),
          const SizedBox(
            height: 10,
          ),
          Row(
            children: [
              DropdownButtonHideUnderline(
                child: DropdownButton2<String>(
                  isExpanded: true,
                  hint: Text(
                    '选择角色',
                    style: TextStyle(
                      fontSize: 14,
                      color: Theme.of(context).hintColor,
                    ),
                  ),
                  items: shownCharacterNames
                      .map((String item) => DropdownMenuItem<String>(
                            value: item,
                            child: Text(
                              item,
                              style: const TextStyle(
                                fontSize: 14,
                              ),
                            ),
                          ))
                      .toList(),
                  value: selectedCharacterName,
                  onChanged: (String? value) {
                    setState(() {
                      selectedCharacterName = value;
                    });
                  },
                  buttonStyleData: ButtonStyleData(
                      padding: const EdgeInsets.symmetric(horizontal: 10),
                      height: 32,
                      width: 220,
                      decoration: BoxDecoration(
                        border: Border.all(color: Colors.black54),
                        borderRadius:
                            const BorderRadius.all(Radius.circular(4.0)),
                      )),
                ),
              ),
            ],
          ),
          const SizedBox(
            height: 10,
          ),
          Row(
            children: [
              SizedBox(
                height: 30,
                child: TextButton(
                  style: ButtonStyle(
                      backgroundColor:
                          MaterialStateProperty.resolveWith((states) {
                        if (states.contains(MaterialState.pressed)) {
                          return Theme.of(context).colorScheme.secondary;
                        }
                        return Theme.of(context).colorScheme.primary;
                      }),
                      shape: MaterialStateProperty.all(
                          const RoundedRectangleBorder(
                        borderRadius: BorderRadius.all(Radius.circular(5.0)),
                        side: BorderSide(
                            color: Color.fromARGB(255, 150, 150, 150)),
                      ))),
                  onPressed:
                      selectedCharacterName == "" ? null : exportButtonHandler,
                  child: const Text(
                    '导出',
                    style: TextStyle(
                      fontSize: 14.0,
                      color: Colors.white,
                    ),
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),
          Row(
            children: [
              SizedBox(
                width: 295,
                child: Text(
                  code,
                  overflow: TextOverflow.ellipsis,
                ),
              ),
              const SizedBox(width: 10),
              SizedBox(
                height: 30,
                child: TextButton(
                  style: ButtonStyle(
                      shape: MaterialStateProperty.all(
                          const RoundedRectangleBorder(
                    borderRadius: BorderRadius.all(Radius.circular(5.0)),
                    side: BorderSide(color: Color.fromARGB(255, 150, 150, 150)),
                  ))),
                  onPressed: code == "" ? null : copyButtonHandler,
                  child: Text(
                    '复制',
                    style: TextStyle(
                      fontSize: 14.0,
                      color: code == "" ? Colors.black26 : Colors.black,
                    ),
                  ),
                ),
              ),
            ],
          ),
        ],
      ),
    );
  }
}
