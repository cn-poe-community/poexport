<template>
  <div>
    <h1>服务</h1>
    <span>POB: {{ pobStatus }} </span><button v-if="pobStatus === 'NeedPatch'" @click="patch">更新</button><br />
    <span>POESESSID: {{ sessionStatus }}</span>
  </div>
  <div>
    <h1>URL编码</h1>
    <input placeholder="论坛账户名" v-model="poeAccountName" />
    <button @click="encode" :disabled="poeAccountName === ''">编码</button>
    <br />
    <input placeholder="编码结果" v-model="encodedValue" disabled />
    <button :disabled="encodedValue === ''" @click="copyEncodedValue">复制</button>
  </div>
</template>

<script lang="ts">
import { PatchFlagNames } from '@vue/shared';
import type { MainAPI } from '../../../ipc/types';

export default {
  data() {
    return {
      poeAccountName: "",
      encodedValue: "",
      pobStatus: "ok",
      sessionStatus: "ok",
    };
  },

  async mounted() {
    this.loadStatus();
  },

  methods: {
    encode() {
      const input = this.poeAccountName;
      if (input) {
        this.encodedValue = encodeURIComponent(input);
      } else {
        this.encodedValue = "";
      }
    },

    copyEncodedValue() {
      navigator.clipboard.writeText(this.encodedValue);
    },

    patch() {
      // @ts-ignore
      const mainAPI = window.mainAPI as MainAPI;
      mainAPI.patchPob().then(() => {
        this.loadStatus();
      }).catch(
        (err) => {
          console.log(err);
        }
      );
    },

    async loadStatus() {
      // @ts-ignore
      const mainAPI = window.mainAPI as MainAPI;
      try {
        const status = await mainAPI.getExporterStatus();
        this.pobStatus = status.pobStatus;
        this.sessionStatus = status.sessionStatus;
      } catch (err) {
        console.log(err);
      }
    }
  }
};
</script>

<style scoped>

</style>
