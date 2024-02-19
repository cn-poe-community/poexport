import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import terser from "@rollup/plugin-terser";

export default [
  {
    input: "src/translator.ts",
    output: {
      file: "dist/translator.js",
      format: "iife",
      name: "Translator",
    },
    plugins: [typescript(), nodeResolve(), terser()],
  },
  {
    input: "src/creator.ts",
    output: {
      file: "dist/creator.js",
      format: "iife",
      name: "Creator",
    },
    plugins: [typescript(), nodeResolve(), terser()],
  },
];
