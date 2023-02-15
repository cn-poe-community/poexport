# poe-cn-export

poe-cn-export项目的后端部分。

# Development

## Commands
Setup
```sh
yarn
```
You may need a VPN network, or use proxy settrings to download `Electron`, like:
```bash
#powershell
$env:ELECTRON_GET_USE_PROXY=1
$env:GLOBAL_AGENT_HTTP_PROXY="http://127.0.0.1:1081"
$env:GLOBAL_AGENT_HTTPS_PROXY="http://127.0.0.1:1081"
```


Develop
```sh
yarn dev
```

Build
```sh
yarn build
```

Lint with [ESLint](https://eslint.org/)
```sh
yarn lint
```
