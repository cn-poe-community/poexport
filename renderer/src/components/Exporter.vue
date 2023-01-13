<template>
  <div>
    <h1>服务</h1>
    <span>已停止</span><br />
    <span>POESESSID已失效</span>
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
export default {
  data() {
    return {
      poeAccountName: "",
      encodedValue: "",
    };
  },

  mounted() {
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
    }
  }
};
</script>

<style scoped>

</style>
