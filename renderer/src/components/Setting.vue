<template>
    <div>
        <label for="poeSessionId">POESESSID:</label>
        <input name="poeSessionId" />
    </div>
    <div>
        <label for="pobPath">POB文件夹:</label>
        <input name="pobPath" disabled />
        <button>选择</button>
    </div>
    <button>保存</button>
</template>

<script lang="ts">
export default {
    data() {
        return {
        };
    },

    mounted() {
    },
};
</script>

<style scoped>

</style>