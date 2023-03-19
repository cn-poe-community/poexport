# poe-cn-export

poe-cn-export 项目的前端部分。

# Development

## Recommended IDE Setup

[VSCode](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur) + [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin).

## Type Support for `.vue` Imports in TS

TypeScript cannot handle type information for `.vue` imports by default, so we replace the `tsc` CLI with `vue-tsc` for type checking. In editors, we need [TypeScript Vue Plugin (Volar)](https://marketplace.visualstudio.com/items?itemName=Vue.vscode-typescript-vue-plugin) to make the TypeScript language service aware of `.vue` types.

## Commands

Project Setup

```sh
yarn
#or
yarn install
```

Compile and Hot-Reload for Development

```sh
yarn dev
```

Type-Check, Compile and Minify for Production

```sh
yarn build
```

Lint with [ESLint](https://eslint.org/)

```sh
yarn lint
```
