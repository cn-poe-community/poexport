<template>
  <div class="container">
    <div class="data-container">
      <textarea class="itemData" v-model="inputs.textItem"></textarea>
      <textarea class="itemData" disabled v-model="inputs.textItemTranlation"></textarea>
    </div>
    <div class="dock">
      <span class="tip">* 仅支持POB使用到的与BD相关的装备的翻译。</span>
      <div class="buttons">
        <button @click="translate" :disabled="inputs.textItem === ''">翻译</button>
        <button @click="copyTranslation" :disabled="inputs.textItemTranlation === ''">
          复制
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { AppWindow } from "../../../ipc/types";
import { useInputsStore } from '@/stores/main';

export default {
  setup() {
    const inputs = useInputsStore();

    return {
      inputs,
    }
  },

  mounted() { },

  methods: {
    translate() {
      const input = this.inputs.textItem;
      if (input) {
        const mainApi = (window as any as AppWindow).mainApi;
        mainApi.translateItem(input).then(result => this.inputs.textItemTranlation = result).catch(e => console.log(e));
      }
    },

    copyTranslation() {
      navigator.clipboard.writeText(this.inputs.textItemTranlation);
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
