# 词缀库
`desc.json` 主词缀库，由`scripts/desc/stats.go`生成，通过解析解包得到的`stat_descriptions.txt`文件得到

`flask.json` 药剂在文本翻译时的额外词缀库

`trade.json` 主词缀库缺失的词缀，包括`增加的小天赋获得：`开头的词缀，目前使用交易网站的数据来维护

`crucible.json` 熔炉词缀中使用`分配 xxx`词缀，等同于涂油词缀，但是因为天赋大点存在重复，一些点没法翻译，使用`分配 xxx`可以提高翻译命中率，提升用户体验