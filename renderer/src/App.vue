<script lang="ts">
export default {
  data() {
    return {
      msg: "",
    };
  },

  mounted() {
    // @ts-ignore
    const versions = window.versions;
    if (versions) {
      this.msg = `本应用正在使用 Chrome (v${versions.chrome()}), Node.js (v${versions.node()}), 和 Electron (v${versions.electron()})`;
    }
  },
};
</script>

<template>
  {{ msg }}
</template>

<style scoped></style>
