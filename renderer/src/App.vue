<script lang="ts" setup>
import Exporter from "./components/Exporter.vue";
import Translator from "./components/Translator.vue";
import Database from "./components/Database.vue";
import Settings from "./components/Settings.vue";
import About from "./components/About.vue";
import { computed, onMounted, ref } from "vue";
import { useI18n } from "vue-i18n";
import type { AppWindow, UpdateInfo } from "./ipc/types";
import { notifyError } from "./components/base/notice";
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
const newVersion = ref(false);
const updateInfo = ref({ currVersion: "", latestVersion: "" } as UpdateInfo);

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
  setTimeout(async () => {
    if (mainApi) {
      try {
        const info = await mainApi.checkForUpdates();
        updateInfo.value = info;
        if (info.currVersion !== info.latestVersion) {
          newVersion.value = true;
        }
      } catch (err) {
        notifyError(err as string);
      }
    }
  }, 1000);
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
      <v-dialog v-model="newVersion" width="auto">
        <v-card>
          <v-toolbar
            color="primary"
            :title="t('New_version')"
            density="compact"
          ></v-toolbar>
          <v-card-text>
            <p>{{ updateInfo.title }}</p>
          </v-card-text>
          <v-card-text>
            <p v-for="line in updateInfo.body">{{ line }}</p>
          </v-card-text>
          <v-card-text>
            <a href="https://www.caimogu.cc/post/348869.html" target="_blank"
              >采蘑菇</a
            >
            <a
              href="https://github.com/me1ting/poe-cn-export"
              style="margin-left: 10px"
              target="_blank"
              >github</a
            >
          </v-card-text>
          <v-card-actions class="justify-end">
            <v-btn color="primary" @click="newVersion = false" variant="text">{{
              t("Close")
            }}</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </v-app>
</template>

<style scoped>
.container {
  margin: 15px;
}
</style>
