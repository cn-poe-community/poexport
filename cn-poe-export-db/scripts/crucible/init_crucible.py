import json
import sys
import re

def pre_handle_text(text: str):
    text = text.replace(" (区域)", "")
    text = text.replace(" (Local)", "")
    text = re.sub(r"\s（等阶 \d）", "", text)
    text = re.sub(r"\s\(Tier \d\)", "", text)
    return text

def is_crucible(label_id: str):
    return label_id == "crucible"


def load_json(file: str):
    with open(file, 'rt', encoding='utf-8') as f:
        content = f.read()
        data = json.loads(content)
    return data


def entries_indexed_by_id(data):
    indexes = {}
    result = data["result"]

    for part in result:
        label_id = part["id"]
        if (is_crucible(label_id)):
            entries = part["entries"]
            for entry in entries:
                full_id: str = entry["id"]
                split_result = full_id.split(".")
                id = split_result[-1]
                indexes[id] = entry

    return indexes


def init(en_entries, zh_entries):
    for id in zh_entries:
        if (id not in en_entries):
            print(f"{id} does not have en data")
            continue

        zh = zh_entries[id]["text"]
        en = en_entries[id]["text"]

        if "分配" not in zh:
            continue

        if "\n" not in zh:
            append_mod(id, zh, en)
        else:
            sub_zh_list = zh.split("\n")
            sub_en_list = en.split("\n")
            for i, sub_zh in enumerate(sub_zh_list):
                sub_en = sub_en_list[i]

                if "分配" in sub_zh:
                    append_mod(id, sub_zh, sub_en)


stats = []
zh_to_en = {}


def append_mod(id, zh, en):
    zh = pre_handle_text(zh)
    en = pre_handle_text(en)

    if zh in zh_to_en:
        if en != zh_to_en[zh]:
            print(f"repeated zh with diff en: {zh}")
        return
    zh_to_en[zh] = en

    stat = {"id": id}
    stat["zh"] = zh
    stat["en"] = en
    stats.append(stat)


if __name__ == "__main__":
    zh_file = "../../docs/trade/tx/stats"
    en_file = "../../docs/trade/stats"

    zh_data = load_json(zh_file)
    en_data = load_json(en_file)

    zh_entries = entries_indexed_by_id(zh_data)
    en_entries = entries_indexed_by_id(en_data)

    init(en_entries, zh_entries)

    db_path = "../../assets/stats/crucible.json"

    with open(db_path, 'wt', encoding="utf-8") as f:
        f.write(json.dumps(stats, ensure_ascii=False, indent=4))
