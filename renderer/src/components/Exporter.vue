<script lang="ts" setup>
import { PobStatus, SessionStatus, type AppWindow } from "@/ipc/types";
import { useStatusStore, useInputsStore } from "@/stores/main";
import { onMounted } from "vue";
import { notifyError, notifyInfo } from "./base/notice";
import { useI18n } from "vue-i18n";

const { t } = useI18n();

const status = useStatusStore();
const inputs = useInputsStore();

let ipcLock = false;

function loadStatus() {
  const mainApi = (window as any as AppWindow).mainApi;
  if (mainApi) {
    mainApi
      .getExporterStatus()
      .then((s) => {
        status.$patch(s);
      })
      .catch((err) => {
        notifyError(err);
      });
  }
}

function encode() {
  const input = inputs.poeAccountName;
  if (input) {
    const encodedValue = encodeURIComponent(input);
    navigator.clipboard.writeText(encodedValue);
    notifyInfo(t("Copied"));
  }
}

function refresh() {
  if (ipcLock) {
    return;
  }
  ipcLock = true;
  const target = document.getElementById("refresh");
  if (target !== null) {
    target.classList.add("refresh-start");
  }
  const mainApi = (window as any as AppWindow).mainApi;
  mainApi
    .getExporterStatus()
    .then((s) => {
      status.$patch(s);
    })
    .catch((err) => {
      notifyError(err);
    })
    .finally(() => {
      ipcLock = false;
      if (target !== null) {
        target.classList.remove("refresh-start");
      }
    });
}

function patch() {
  if (ipcLock) {
    return;
  }
  ipcLock = true;
  const mainApi = (window as any as AppWindow).mainApi;
  mainApi
    .patchPob()
    .then(() => {
      loadStatus();
    })
    .catch((err) => {
      notifyError(err);
    })
    .finally(() => {
      ipcLock = false;
    });
}

onMounted(() => {
  loadStatus();
});
</script>

<template>
  <header>
    <p class="text-h5">{{ t("Export") }}</p>
  </header>
  <v-card :title="t('Status')">
    <v-btn
      id="refresh"
      icon="$refresh"
      color="primary"
      variant="plain"
      @click="refresh"
    >
    </v-btn>
    <v-tooltip activator="#refresh" location="top">{{
      t("Refresh")
    }}</v-tooltip>
    <v-list density="compact">
      <v-list-item>
        <template v-slot:prepend>
          <p>POESESSID</p>
        </template>
        <template v-slot:append>
          <v-icon
            color="green"
            icon="$checkCircleOutline"
            v-if="status.sessionStatus === SessionStatus.OK"
          />
          <v-icon color="red" icon="$alertCircleOutline" v-else />
        </template>
      </v-list-item>
      <v-list-item>
        <template v-slot:prepend>
          <p>POB</p>
        </template>
        <template v-slot:append>
          <v-icon
            color="green"
            icon="$checkCircleOutline"
            v-if="status.pobStatus === PobStatus.OK"
          />
          <v-icon
            color="red"
            icon="$alertCircleOutline"
            v-else-if="status.pobStatus === PobStatus.NOT_FOUND"
          />
          <a class="update" v-else @click="patch">Patch</a>
        </template>
      </v-list-item>
      <v-list-item>
        <template v-slot:prepend>
          <p>{{ t("Listening_Port") }}</p>
        </template>
        <template v-slot:append>
          <p>{{ status.port }}</p>
        </template>
      </v-list-item>
    </v-list>
  </v-card>
  <v-card :title="t('Url_Encoding')">
    <v-list density="compact">
      <v-list-item>
        <v-text-field
          :label="t('Account')"
          density="compact"
          v-model="inputs.poeAccountName"
          single-line
          spellcheck="false"
          ><template v-slot:append
            ><v-btn @click="encode" :disabled="!inputs.poeAccountName">{{
              t("Encoding")
            }}</v-btn>
          </template></v-text-field
        >
      </v-list-item>
    </v-list>
  </v-card>
</template>

<style scoped>
.v-card {
  margin-top: 20px;
}

#refresh {
  position: absolute;
  top: 5px;
  right: 5px;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

.refresh-start {
  animation-name: rotate;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-play-state: running;
}

.update {
  vertical-align: top;
  border-bottom: 1px dashed;
  color: red;
  cursor: pointer;
  text-decoration: none;
}
</style>
