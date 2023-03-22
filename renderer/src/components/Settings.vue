<script lang="ts" setup>
import { useConfigStore } from "@/stores/main";
import type { AppWindow, Language } from "@/ipc/types";
import { useI18n } from "vue-i18n";
import { notifyError, notifySuccess } from "./base/notice";
import { onMounted, ref } from "vue";

const { t, locale } = useI18n();
const config = useConfigStore();
let ipcLock = false;

const poeSessIdDialog = ref(false);
const poeSessIdInput = ref(config.poeSessId);

interface LanguageItem {
  title: string;
  value: Language;
}

const languageItemList: LanguageItem[] = [
  { title: "简体中文", value: "zh_CN" },
  { title: "English", value: "en_US" },
];

function loadConfig() {
  if (ipcLock) {
    return;
  }
  ipcLock = true;
  const mainApi = (window as any as AppWindow).mainApi;
  if (mainApi) {
    mainApi
      .getConfig()
      .then((c) => {
        config.language = c.language;
        config.poeSessId = c.poeSessId;
        config.pobPath = c.pobPath;
        config.pobProxySupported = c.pobProxySupported;
      })
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => {
        ipcLock = false;
      });
  } else {
    ipcLock = false;
  }
}

function resetConfig() {
  if (ipcLock) {
    return;
  }
  ipcLock = true;
  const mainApi = (window as any as AppWindow).mainApi;
  if (mainApi) {
    mainApi
      .resetConfig()
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => {
        ipcLock = false;
        loadConfig();
      });
  } else {
    ipcLock = false;
  }
}

function updateLanguage(lang: Language) {
  locale.value = lang;
  config.language = lang;
  const mainApi = (window as any as AppWindow).mainApi;
  if (mainApi) {
    mainApi.setLanguage(lang as Language).catch((err) => notifyError(err));
  }
}

function openPoeSessIdDialog() {
  poeSessIdInput.value = config.poeSessId;
  poeSessIdDialog.value = true;
}

function updatePoeSessIdInput(input: string) {
  poeSessIdInput.value = input;
}

function setPoeSessId() {
  if (ipcLock) {
    return;
  }

  ipcLock = true;
  config.poeSessId = poeSessIdInput.value;
  const mainApi = (window as any as AppWindow).mainApi;
  if (mainApi) {
    mainApi
      .setPoeSessId(poeSessIdInput.value)
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => {
        ipcLock = false;
      });
  } else {
    ipcLock = false;
  }

  poeSessIdDialog.value = false;
}

function setPobPath() {
  if (ipcLock) {
    return;
  }
  ipcLock = true;
  const electronApi = (window as any as AppWindow).electronApi;
  if (electronApi) {
    electronApi
      .openFolder()
      .then((path) => {
        if (path) {
          config.pobPath = path;
          const mainApi = (window as any as AppWindow).mainApi;
          if (mainApi) {
            mainApi
              .setPobPath(path)
              .catch((err) => {
                notifyError(err);
              })
              .finally(() => {
                ipcLock = false;
              });
          }
        }
      })
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => {
        ipcLock = false;
      });
  }
}

function showFolder(path: string) {
  const electronApi = (window as any as AppWindow).electronApi;
  if (electronApi) {
    electronApi.showFolder(path);
  }
}

function updatePobProxySupported(supported?: boolean) {
  if (ipcLock || supported === undefined) {
    return;
  }

  ipcLock = true;
  config.pobProxySupported = supported;

  const mainApi = (window as any as AppWindow).mainApi;
  if (mainApi) {
    mainApi
      .setPobProxySupported(config.pobProxySupported)
      .catch((err) => notifyError(err))
      .finally(() => {
        ipcLock = false;
      });
  } else {
    ipcLock = false;
  }
}

function removePatch() {
  if (ipcLock) {
    return;
  }
  ipcLock = true;
  const mainApi = (window as any as AppWindow).mainApi;
  if (mainApi) {
    mainApi
      .resetPob()
      .then(() => {
        notifySuccess(t("Success"));
      })
      .catch((err) => {
        notifyError(err);
      })
      .finally(() => {
        ipcLock = false;
      });
  } else {
    ipcLock = false;
  }
}

onMounted(() => {
  loadConfig();
});
</script>

<template>
  <header class="header">
    <p class="text-h5">{{ t("Settings") }}</p>
    <div>
      <div class="button pointer" @click="resetConfig">{{ t("Reset") }}</div>
    </div>
  </header>
  <div class="cards">
    <v-card :subtitle="t('Basic')">
      <v-list density="compact">
        <v-list-item>
          <template v-slot:prepend>
            <p>{{ t("Language") }}</p>
          </template>
          <template v-slot:append>
            <v-select
              variant="outlined"
              color="primary"
              density="compact"
              hide-details
              :items="languageItemList"
              :model-value="locale"
              @update:model-value="updateLanguage"
            ></v-select>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card subtitle="POE-CN">
      <v-list density="compact">
        <v-list-item>
          <p>
            <span>POESESSID</span>
            <v-btn
              style="margin-left: 5px"
              icon="$cog"
              size="small"
              color="primary"
              variant="plain"
              density="compact"
              @click="openPoeSessIdDialog"
            ></v-btn>
            <v-dialog v-model="poeSessIdDialog" width="auto">
              <v-card>
                <v-card-text
                  ><v-text-field
                    variant="outlined"
                    color="primary"
                    spellcheck="false"
                    :model-value="poeSessIdInput"
                    @update:model-value="updatePoeSessIdInput"
                    size="40"
                  ></v-text-field
                ></v-card-text>
                <v-card-actions class="justify-end">
                  <v-btn color="primary" @click="setPoeSessId" variant="text"
                    >Save</v-btn
                  >
                </v-card-actions>
              </v-card>
            </v-dialog>
          </p>
          <template v-slot:append
            ><v-text-field
              variant="outlined"
              density="compact"
              hide-details
              color="primary"
              :model-value="config.poeSessId"
              disabled
              size="15"
            ></v-text-field
          ></template>
        </v-list-item>
      </v-list>
    </v-card>
    <v-card subtitle="POB">
      <v-list density="compact">
        <v-list-item>
          <p>
            <span>{{ t("POB_Path") }}</span>
            <v-btn
              style="margin-left: 5px"
              icon="$cog"
              size="small"
              color="primary"
              variant="plain"
              density="compact"
              @click="setPobPath"
            ></v-btn>
          </p>
          <template v-slot:append>
            <v-btn
              icon="$arrowRight"
              color="black"
              variant="plain"
              density="compact"
              @click="showFolder(config.pobPath)"
            >
            </v-btn>
          </template>
        </v-list-item>
        <v-list-item>
          <p>{{ t("Proxy_Supported") }}</p>
          <template v-slot:append>
            <v-switch
              color="primary"
              density="compact"
              hide-details
              :model-value="config.pobProxySupported"
              @update:model-value="updatePobProxySupported"
            ></v-switch>
          </template>
        </v-list-item>
        <v-list-item>
          <p>{{ t("Patch") }}</p>
          <template v-slot:append>
            <v-btn variant="plain" density="compact" @click="removePatch">{{
              t("Remove")
            }}</v-btn>
          </template>
        </v-list-item>
      </v-list>
    </v-card>
  </div>
</template>

<style scoped>
.header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.header .button {
  background-color: #f0f0f0;
  border-radius: 3px;
  padding: 4px 11px;
  vertical-align: middle;
  color: red;
}

.v-card {
  margin-top: 20px;
}
</style>
