<script lang="ts" setup>
import Exporter from "./components/Exporter.vue";
import Translator from "./components/Translator.vue";
import Database from "./components/Database.vue";
import Settings from "./components/Settings.vue";
import About from "./components/About.vue";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { AppWindow } from "./ipc/types";
const { t, locale } = useI18n();

type Navigation = {
  title: string;
  href: string;
};

const navigationList: Navigation[] = [
  { title: "Export", href: "#/" },
  { title: "Translate", href: "#/translation" },
  //{ title: "Query", href: "#/query" },
  { title: "Settings", href: "#/settings" },
  //{ title: "About", href: "#/about" },
];

const routes: { [id: string]: any } = {
  "/": Exporter,
  "/translation": Translator,
  "/query": Database,
  "/settings": Settings,
  "/about": About,
};

const currentPath = ref("#/");

const currentView = computed(() => {
  return routes[currentPath.value.slice(1) || "/"];
});

onMounted(async () => {
  window.addEventListener("hashchange", () => {
    currentPath.value = window.location.hash;
  });
  const mainApi = (window as unknown as AppWindow).mainApi;
  if (mainApi) {
    const config = await mainApi.getConfig();
    const localeInConfig = config.language;
    if (locale.value !== localeInConfig) {
      locale.value = localeInConfig;
    }
  }
});
</script>

<template>
  <v-app>
    <v-navigation-drawer permanent disable-resize-watcher floating width="120">
      <v-list density="compact" color="primary" nav>
        <v-list-item
          v-for="item in navigationList"
          :active="currentPath === item.href"
          :value="item.href"
          :href="item.href"
          :key="item.href"
        >
          <p
            class="text-center"
            :class="{ 'text-text-secondary': currentPath !== item.href }"
          >
            {{ t(item.title) }}
          </p>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-main style="">
      <div class="container">
        <component :is="currentView" />
      </div>
    </v-main>
  </v-app>
</template>

<style scoped>
.container {
  margin: 15px;
}
</style>
