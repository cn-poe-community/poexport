import json
import os
from pathlib import Path
import re
import subprocess
import sys
import urllib.request

USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36"

def must_parent(path:str):
    '''确保文件所在路径存在'''
    Path(path).parent.mkdir(parents=True, exist_ok=True)

def load_json(file):
    with open(file, 'rt', encoding='utf-8') as f:
        content = f.read()
        data = json.loads(content)
    return data


config: dict = load_json("./config.json")

project_root = config.get("projectRoot")

# --- tree

tree_url = "https://www.pathofexile.com/passive-skill-tree"
tx_tree_url = "https://poe.game.qq.com/passive-skill-tree"

tree_file = "docs/tree/tree.json"
tx_tree_file = "docs/tree/tx/tree.json"


def get_tree_from_html(html: str) -> str:
    html = html.replace("\n", "")
    pattern = re.compile(
        r"var passiveSkillTreeData = (\{.+?\});")
    m = pattern.search(html)
    return m.group(1)


def download_tree(url: str, save_path: str):
    must_parent(save_path)
    print(f"downloading {url}")
    req = urllib.request.Request(url, headers={'User-agent': USER_AGENT})
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        tree_text = get_tree_from_html(html)
        with open(f'{save_path}', 'wt', encoding="utf-8") as f:
            f.write(tree_text)
        print(f"saved {save_path}")


def download_trees():
    download_tree(tree_url, os.path.join(project_root, tree_file))
    download_tree(tx_tree_url, os.path.join(project_root, tx_tree_file))

# --- trade files


trade_urls = ["https://www.pathofexile.com/api/trade/data/stats",
              "https://www.pathofexile.com/api/trade/data/static",
              "https://www.pathofexile.com/api/trade/data/items"]

tx_trade_urls = ["https://poe.game.qq.com/api/trade/data/stats",
                 "https://poe.game.qq.com/api/trade/data/static",
                 "https://poe.game.qq.com/api/trade/data/items"]

tx_poesessid = config.get("txPoesessid")


def download_trade_file(url: str, is_tx=False):
    base_name = url.split("/")[-1]
    saved_path = os.path.join(project_root, "docs/trade", base_name)


    headers = {'User-agent': USER_AGENT}

    if is_tx:
        saved_path = os.path.join(project_root, "docs/trade/tx", base_name)
        headers = {'User-agent': USER_AGENT,
                   'Cookie': f'POESESSID={tx_poesessid}'}
        
    must_parent(saved_path)

    print(f"downloading {url}")
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8')
        with open(saved_path, 'wt', encoding="utf-8") as f:
            f.write(content)
    print(f"saved {saved_path}")


def download_trade_files():
    for url in trade_urls:
        download_trade_file(url)
        pass
    for url in tx_trade_urls:
        download_trade_file(url,True)

# --- schema


schema_url = "https://github.com/poe-tool-dev/dat-schema/releases/download/latest/schema.min.json"
schema_file = "docs/schema.min.json"


def download_schema():
    saved_path = os.path.join(project_root, schema_file)
    must_parent(saved_path)

    print(f"downloading {schema_url}")
    req = urllib.request.Request(
        schema_url, headers={'User-agent': USER_AGENT})
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8')
        with open(saved_path, 'wt', encoding="utf-8") as f:
            f.write(content)
    print(f"saved {saved_path}")

# --- dat and json


extractor = "tools/ExtractBundledGGPK3/ExtractBundledGGPK3.exe"
ggpk = config.get("ggpk")
txGgpk = config.get("txGgpk")
poedat = "tools/poedat/poedat.exe"

bundled_files = [
    "metadata/statdescriptions/stat_descriptions.txt",
    "metadata/statdescriptions/passive_skill_stat_descriptions.txt",
    "metadata/statdescriptions/tincture_stat_descriptions.txt",
    "data/indexablesupportgems.dat64",
    "data/indexableskillgems.dat64",
    "data/baseitemtypes.dat64",
    "data/gemeffects.dat64"
]

tx_bundled_files = [
    "metadata/statdescriptions/stat_descriptions.txt",
    "metadata/statdescriptions/passive_skill_stat_descriptions.txt",
    "metadata/statdescriptions/tincture_stat_descriptions.txt",
    "data/simplified chinese/indexablesupportgems.dat64",
    "data/simplified chinese/indexableskillgems.dat64",
    "data/simplified chinese/baseitemtypes.dat64",
    "data/simplified chinese/gemeffects.dat64"
]


tables = {
        "indexablesupportgems.dat64": "IndexableSupportGems",
         "indexableskillgems.dat64": "IndexableSkillGems",
         "baseitemtypes.dat64": "BaseItemTypes",
         "gemeffects.dat64": "GemEffects"
}

def extractBundledFiles():
    extractor_fullpath = os.path.join(project_root,extractor)
    poedat_fullpath = os.path.join(project_root,poedat)
    schema_fullpath = os.path.join(project_root, schema_file)

    for file in bundled_files:
        print(f"extracting {file}")
        saved_path = os.path.join(project_root, "docs/ggpk", file)
        must_parent(saved_path)
        code = subprocess.call([extractor_fullpath, ggpk, file,saved_path])
        if code !=0:
            raise Exception(f"extracted {file} failed")
        print(f"saved {saved_path}")

        basename  = file.split("/")[-1]
        if basename in tables:
            print(f"creating {saved_path}.json")
            code = subprocess.call([poedat_fullpath, "-d",saved_path, "-s",schema_fullpath,"-t",tables.get(basename)])
            if code != 0:
                print(f"warning: create json failed")
            else:
                print(f"created success")
    
    for file in tx_bundled_files:
        print(f"extracting {file}")
        saved_path = os.path.join(project_root, "docs/ggpk/tx", file)
        must_parent(saved_path)
        code = subprocess.call([extractor_fullpath, txGgpk, file, saved_path])
        if code !=0:
            raise Exception(f"extracted {file} failed")
        print(f"saved {saved_path}")

        basename  = file.split("/")[-1]
        if basename in tables:
            print(f"creating {saved_path}.json")
            code = subprocess.call([poedat_fullpath, "-d",saved_path, "-s",schema_fullpath,"-t",tables.get(basename)])
            if code != 0:
                print(f"warning: create json failed")
            else:
                print(f"created success")

if __name__ == "__main__":
    args = sys.argv[1:]
    if len(args)==0:
        download_trees()
        download_trade_files()
        download_schema()
        extractBundledFiles()
    else:
        task = args[0]
        if task == "tree":
            download_trees()
        elif task == "traded":
            download_trade_files()
        elif task == "schema":
            download_schema()
        elif task == "bundled":
            extractBundledFiles()
        else:
            print(f"there is no task matched {task}")
