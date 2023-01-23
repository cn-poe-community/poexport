<template>
  <div>
    <textarea class="itemData" v-model="item"></textarea>
    <textarea class="itemData" v-model="itemTranslation"></textarea>
  </div>
  <button @click="translate" :disabled="item === ''">翻译</button>
  <button @click="copyTranslation" :disabled="itemTranslation === ''">
    复制
  </button>
</template>

<script lang="ts">
export default {
  data() {
    return {
      item: "",
      itemTranslation: "",
    };
  },

  mounted() {},

  methods: {
    translate() {
      const input = this.item;
      if (input) {
        //TODO: add really codes
        this.itemTranslation = input;
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

.itemData {
  height: 80vh;
  width: 40vw;
}
</style>
