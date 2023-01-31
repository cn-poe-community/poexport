<script lang="ts" setup>
import Exporter from "./components/Exporter.vue";
import Translator from "./components/Translator.vue";
import Database from "./components/Database.vue";
import Setting from "./components/Setting.vue";
</script>

<template>
  <main>
    <div class="activitybar">
      <ul class="actions-container">
        <li class="action-item pointer" :class="{ checked: action === 'export' }" @click="switchAction('export')">
          <a>BD导出</a>
        </li>
        <li class="action-item pointer" :class="{ checked: action === 'translation' }"
          @click="switchAction('translation')">
          <a>物品翻译</a>
        </li>
        <li class="action-item pointer" :class="{ checked: action === 'query' }" @click="switchAction('query')">
          <a>数据库查询</a>
        </li>
      </ul>
      <ul class="actions-container bottom">
        <li class="action-item pointer" :class="{ checked: action === 'setting' }" @click="switchAction('setting')">
          设置
        </li>
      </ul>
    </div>
    <div class="content">
      <Exporter v-if="action === 'export'" />
      <Translator v-else-if="action === 'translation'" />
      <Database v-else-if="action === 'query'" />
      <Setting v-else-if="action === 'setting'" />
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

  mounted() { },

  methods: {
    switchAction(action: string) {
      this.action = action;
    },
  },
};
</script>

<style scoped>
main {
  display: flex;
  height: 100%;
}

.activitybar {
  width: 100px;
  background: #f5f5f5;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  flex: 0 0 auto;
}

.actions-container {
  margin: 20px 0;
}

.action-item {
  padding: 8px 0px;
  text-align: center;
  color: #475665;
}

.action-item a {
  font-size: 14px;
}

.checked {
  background: #fff;
  color: #000000;
}

.content {
  flex: 1 1 auto;
}
</style>
