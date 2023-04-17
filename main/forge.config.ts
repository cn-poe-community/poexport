import type { ForgeConfig } from "@electron-forge/shared-types";
import { MakerZIP } from "@electron-forge/maker-zip";
import { WebpackPlugin } from "@electron-forge/plugin-webpack";

import { mainConfig } from "./webpack.main.config";
import { rendererConfig } from "./webpack.renderer.config";

const config: ForgeConfig = {
  packagerConfig: {
    icon: "icons/icon.png",
  },
  rebuildConfig: {},
  makers: [
    new MakerZIP({}, ["win32"]),
    {
      name: "@electron-forge/maker-wix",
      config: {
        language: 1033,
        manufacturer: "me1ting",
        icon: "icons/icon.ico",
        upgradeCode: "dd4b912e-dcdc-11ed-afa1-0242ac120002"
      },
    },
  ],
  plugins: [
    new WebpackPlugin({
      mainConfig,
      renderer: {
        config: rendererConfig,
        entryPoints: [
          {
            html: "./src/index.html",
            js: "./src/renderer.ts",
            name: "main_window",
            preload: {
              js: "./src/preload.ts",
            },
          },
        ],
      },
    }),
  ],
};

export default config;
