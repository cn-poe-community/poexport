<template>
  <div>
    <label for="poeSessionId">POESESSID:</label>
    <input name="poeSessionId" v-model="poeSessionId" />
  </div>
  <div>
    <label for="pobPath">POB文件夹:</label>
    <input name="pobPath" v-model="pobPath" disabled />
    <button @click="openFolder">选择</button>
  </div>
  <button @click="saveConfig">保存</button>
</template>

<script lang="ts">
import type { Config, ElectronAPI, MainAPI } from "../../../ipc/types";

export default {
  data() {
    return {
      poeSessionId: "",
      pobPath: "",
    };
  },

  async mounted() {
    // @ts-ignore
    const mainAPI = window.mainAPI as MainAPI;
    const config: Config = await mainAPI.getConfig();
    this.poeSessionId = config.poeSessId;
    this.pobPath = config.pobPath;
  },

  methods: {
    async openFolder() {
      // @ts-ignore
      const electronAPI = window.electronAPI as ElectronAPI;
      const filePath = await electronAPI.openFolder();
      if (filePath) {
        this.pobPath = filePath;
      }
    },
    saveConfig() {
      // @ts-ignore
      const mainAPI = window.mainAPI as MainAPI;
      // @ts-ignore
      const config: Config = {
        poeSessId: this.poeSessionId,
        pobPath: this.pobPath,
      };
      mainAPI.setConfig(config).then((error) => {
        if (error) {
          console.log(error);
        }
      });
    },
  },
};
</script>

<style scoped></style>
