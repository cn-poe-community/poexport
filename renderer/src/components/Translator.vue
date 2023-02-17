<template>
  <div class="container">
    <div class="data-container">
      <textarea class="itemData" v-model="item"></textarea>
      <textarea class="itemData" disabled v-model="itemTranslation"></textarea>
    </div>
    <div class="dock">
      <span class="tip">* 仅支持POB使用到的与BD相关的装备的翻译。</span>
      <div class="buttons">
        <button @click="translate" :disabled="item === ''">翻译</button>
        <button @click="copyTranslation" :disabled="itemTranslation === ''">
          复制
        </button>
      </div>
    </div>
</div>
</template>

<script lang="ts">
import type { MainAPI } from "../../../ipc/types";

export default {
  data() {
    return {
      item: "",
      itemTranslation: "",
    };
  },

  mounted() { },

  methods: {
    translate() {
      const input = this.item;
      if (input) {
        // @ts-ignore
        const mainAPI = window.mainAPI as MainAPI;
        mainAPI.translateItem(input).then(result => this.itemTranslation = result).catch(e => console.log(e));
      }
    },

    copyTranslation() {
      navigator.clipboard.writeText(this.itemTranslation);
    },
  },
};
</script>

<style scoped>
textarea {
  resize: none;
}

.container {
  margin: 0 10px;
}

.data-container {
  display: flex;
}

.itemData {
  height: 80vh;
  width: 50%;
}

.tip {
  font-size: 13px;
  font-style: italic;
}

.buttons {
  margin-top: 10px;
}

.buttons>button:nth-child(n+2) {
  margin-left: 2px;
}
</style>
