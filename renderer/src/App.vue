<script lang="ts" setup>
import Exporter from "./components/Exporter.vue";
import Translator from "./components/Translator.vue";
import Database from "./components/Database.vue";
import Setting from "./components/Setting.vue";
import About from "./components/About.vue";
</script>

<template>
  <main>
    <div class="activitybar">
      <ul class="actions-container">
        <li
          class="action-item pointer"
          :class="{ checked: action === Action.EXPORT }"
          @click="switchAction(Action.EXPORT)"
        >
          <a>BD导出</a>
        </li>
        <li
          class="action-item pointer"
          :class="{ checked: action === Action.TRANSLATION }"
          @click="switchAction(Action.TRANSLATION)"
        >
          <a>物品翻译</a>
        </li>
        <li
          class="action-item pointer"
          :class="{ checked: action === Action.QUERY }"
          @click="switchAction(Action.QUERY)"
        >
          <a>数据库查询</a>
        </li>
      </ul>
      <ul class="actions-container bottom">
        <li
          class="action-item pointer"
          :class="{ checked: action === Action.SETTINGS }"
          @click="switchAction(Action.SETTINGS)"
        >
          设置
        </li>
        <li
          class="action-item pointer"
          :class="{ checked: action === Action.ABOUT }"
          @click="switchAction(Action.ABOUT)"
        >
          关于
        </li>
      </ul>
    </div>
    <div class="content">
      <Exporter v-if="action === Action.EXPORT" />
      <Translator v-else-if="action === Action.TRANSLATION" />
      <Database v-else-if="action === Action.QUERY" />
      <Setting v-else-if="action === Action.SETTINGS" />
      <About v-else-if="action === Action.ABOUT" />
    </div>
  </main>
</template>

<script lang="ts">
enum Action {
  EXPORT,
  TRANSLATION,
  QUERY,
  SETTINGS,
  ABOUT,
}

export default {
  data() {
    return {
      action: Action.EXPORT,
    };
  },

  mounted() {},

  methods: {
    switchAction(action: Action) {
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
