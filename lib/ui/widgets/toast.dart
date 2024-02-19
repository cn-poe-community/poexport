import 'package:flutter/material.dart';
import 'package:fluttertoast/fluttertoast.dart';

void showToast(FToast fToast, String msg) {
  Widget toast = Container(
    padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 10.0),
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(5.0),
      color: const Color.fromARGB(0xbb, 0x2a, 0x2a, 0x2a),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          msg,
          style: const TextStyle(color: Colors.white),
        ),
      ],
    ),
  );

  fToast.showToast(
    child: toast,
    gravity: ToastGravity.BOTTOM,
    toastDuration: const Duration(seconds: 1),
  );
}

void showErrToast(FToast fToast, String msg) {
  Widget toast = Container(
    padding: const EdgeInsets.symmetric(horizontal: 15.0, vertical: 10.0),
    decoration: BoxDecoration(
      borderRadius: BorderRadius.circular(5.0),
      border: Border.all(color: const Color.fromARGB(0xbb, 0x2a, 0x2a, 0x2a)),
      //color: const Color.fromARGB(0xbb, 0xff, 0xff, 0xff),
    ),
    child: Row(
      mainAxisSize: MainAxisSize.min,
      children: [
        Text(
          msg,
          style: const TextStyle(color: Colors.red),
        ),
      ],
    ),
  );

  fToast.showToast(
    child: toast,
    gravity: ToastGravity.BOTTOM,
    toastDuration: const Duration(seconds: 2),
  );
}
