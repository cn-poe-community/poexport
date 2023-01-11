<script lang="ts" setup>
import Exporter from './components/Exporter.vue';
import Translator from './components/Translator.vue';
import Database from './components/Database.vue';
</script>

<template>
  <main>
    <div class="activitybar">
      <ul class="actions-container">
        <li class="action-item" :class="{ checked: action === 'export' }" @click="switchAction('export')">
          <a>BD导出</a>
        </li>
        <li class="action-item" :class="{ checked: action === 'translation' }" @click="switchAction('translation')">
          <a>物品翻译</a>
        </li>
        <li class="action-item" :class="{ checked: action === 'query' }" @click="switchAction('query')">
          <a>数据库查询</a>
        </li>
      </ul>
    </div>
    <div class="content">
      <Exporter v-if="action === 'export'" />
      <Translator v-else-if="action === 'translation'" />
      <Database v-else-if="action === 'query'" />
    </div>
  </main>
</template>

<script lang="ts">
export default {
  data() {
    return {
      action: "export",
    };
  },

  mounted() {
  },

  methods: {
    switchAction(action: string) {
      this.action = action;
    }
  }
};
</script>

<style scoped>
main {
  display: flex;
  height: 100%;
}

.activitybar {
  width: 70px;
  background: rgb(207, 207, 207);
}

.checked {
  background: #fff;
}
</style>
