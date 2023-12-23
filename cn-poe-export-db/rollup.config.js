import typescript from "@rollup/plugin-typescript";
import terser from '@rollup/plugin-terser';

export default [
  {
    input: "src/index.ts",
    output: {
      dir:"dist/",
      format: "esm"
    },
    plugins: [typescript()],
  },
  {
    input: "src/index.ts",
    output: {
      file: "dist/db.global.js",
      format: "iife",
      name: "CnPoeExportDb"
    },
    plugins: [terser()],
    plugins: [typescript(), terser()],
  }
];
