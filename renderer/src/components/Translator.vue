<script lang="ts" setup>
import type { AppWindow } from "@/ipc/types";
import { useInputsStore } from "@/stores/main";
import { notifyError, notifyInfo } from "./base/notice";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const inputs = useInputsStore();

function translate() {
  const input = inputs.textItem;
  if (input) {
    const mainApi = (window as any as AppWindow).mainApi;
    mainApi
      .translateItem(input)
      .then((result) => {
        inputs.textItemTranlation = result;
        navigator.clipboard.writeText(inputs.textItemTranlation);
        notifyInfo(t("copied"));
      })
      .catch((err) => notifyError(err));
  }
}
</script>

<template>
  <div class="texts-container">
    <textarea
      class="itemData textItem"
      v-model="inputs.textItem"
      spellcheck="false"
    ></textarea>
    <textarea
      class="itemData translation"
      disabled
      v-model="inputs.textItemTranlation"
    ></textarea>
  </div>
  <div class="dock">
    <p class="tip">{{ t("Only_equipments_are_supported") }}</p>
    <div class="buttons">
      <v-btn @click="translate" :disabled="inputs.textItem === ''">{{
        t("Translate")
      }}</v-btn>
    </div>
  </div>
</template>

<style scoped>
textarea {
  resize: none;
  border: solid 1px;
  padding: 5px;
}

.texts-container {
  display: flex;
}

.itemData {
  height: 78vh;
  width: 50%;
}

.translation {
  background-color: #f5f5f5;
}

.tip {
  font-size: 13px;
  font-style: italic;
  margin: 5px 0;
}
</style>
