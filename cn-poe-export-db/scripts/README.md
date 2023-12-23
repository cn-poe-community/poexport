# 脚本说明

目前使用了以下脚本：

- prepare.py 下载本项目依赖的外部数据，以及解包游戏数据
- crucible/init_crucible.py：根据 trade data 生成 assets/stats/crucible.json
- desc/stats.go：根据解包文件，生成 assets/stats/desc.json
- gem/main.go 根据解包文件，生成 assets/gems/gems.json
- item/main.go 根据解包文件, 生成 assets/tattoos.json
- trade/check_items.py: 根据 trade data 检查 assets/*.json（除了assets/gems.json）
- tree/init_passiveskills.py：根据 tree data 生成 assets/passiveskills/*

## 配置文件

部分脚本依赖配置文件，复制`config.json.demo`并重命名为`config.json`，然后修改以满足需求。

## prepare.py

`prepare.py`负责下载本项目所依赖的外部数据，以及解包游戏数据。

脚本支持拆分的子命令：

```bash
# 下载所有数据，解包所有数据
python ./prepare.py

# 下载天赋树文件
python ./prepare.py tree

# 下载schema文件
pyhon ./prepare.py schema

# 下载交易网站上的文件
pyhon ./prepare.py traded

# 解包数据
pyhon ./prepare.py bundled
```
