<template>
  <div class="container">
    <div class="header-container">
      <header class="header">
        <h1>设置</h1>
        <div>
          <div class="button pointer" @click="resetConfig">重置</div>
        </div>
      </header>
    </div>
    <div class="details-container">
      <div class="details">
        <div class="details-section">
          <header>
            <h2>基本</h2>
          </header>
          <div class="section-lines">
            <div class="line">
              <label for="poeSessionId">POESESSID</label>
              <div class="line-right">
                <input name="poeSessionId" v-model="poeSessionId" />
                <button class="pointer" @click="setPoeSessId">保存</button>
              </div>
            </div>
            <div class="line">
              <label for="pobPath">POB文件夹</label>
              <div class="line-right">
                <input name="pobPath" v-model="pobPath" disabled />
                <button class="pointer" @click="setPobPath">选择</button>
              </div>
            </div>
          </div>
        </div>
        <div class="details-section">
          <header>
            <h2>Patch</h2>
          </header>
          <div class="section-lines">
            <div class="line">
              <div class="line-left">
                <label for="poeSessionId">清除Patch</label>
              </div>
              <div class="line-right">
                <button class="pointer" @click="resetPob">重置</button>
              </div>
            </div>
            <div class="line">
              <div class="line-left">
                <label for="poeSessionId">Proxy支持</label>
                <VDropdown :distance="1" :placement="'right'" :triggers="['hover', 'focus']">
                  <span class="material-symbols-outlined warning">warning</span>
                  <template #popper>
                    <div class="tooltip-container">
                      <div>一些代理不支持本软件，你可以取消POB代理设置，或使用该选项。</div>
                      <div class="warning">警告：该选项会修改POB代码，可能导致POB无法正常启动。</div>
                    </div>
                  </template>
                </VDropdown>
              </div>
              <div class="line-right">
                <input type="checkbox" class="pointer" v-model="pobProxySupported" @change="setPobProxySupported">
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { AppWindow } from "../../../ipc/types";

export default {
  data() {
    return {
      ipcLocked: false,
      poeSessionId: "",
      pobPath: "",
      pobProxySupported: false,
    };
  },

  mounted() {
    this.loadConfig();
  },

  methods: {
    loadConfig() {
      if (this.ipcLocked) {
        return;
      }
      this.ipcLocked = true;
      const mainApi = (window as any as AppWindow).mainApi;
      mainApi.getConfig()
        .then(config => {
          this.poeSessionId = config.poeSessId;
          this.pobPath = config.pobPath;
          this.pobProxySupported = config.pobProxySupported;
        }).catch(err => {
          console.log(err);
        }).finally(() => {
          this.ipcLocked = false;
        });
    },
    resetConfig() {
      if (this.ipcLocked) {
        return;
      }
      this.ipcLocked = true;
      const mainApi = (window as any as AppWindow).mainApi;
      mainApi.resetConfig()
        .catch(err => {
          console.log(err);
        }).finally(() => {
          this.ipcLocked = false;
          this.loadConfig();
        });
    },
    setPoeSessId() {
      if (this.ipcLocked) {
        return;
      }
      this.ipcLocked = true;
      const mainApi = (window as any as AppWindow).mainApi;
      mainApi.setPoeSessId(this.poeSessionId)
        .catch(err => {
          console.log(err);
        }).finally(() => {
          this.ipcLocked = false;
        });
    },
    setPobPath() {
      if (this.ipcLocked) {
        return;
      }
      this.ipcLocked = true;
      const electronApi = (window as any as AppWindow).electronApi;
      const filePath = electronApi.openFolder().then(path => {
        if (path) {
          this.pobPath = path;
          const mainApi = (window as any as AppWindow).mainApi;
          mainApi.setPobPath(path)
            .catch(err => {
              console.log(err);
            }).finally(() => {
              this.ipcLocked = false;
            });
        }
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        this.ipcLocked = false;
      });
    },
    setPobProxySupported() {
      if (this.ipcLocked) {
        return;
      }
      this.ipcLocked = true;
      const mainApi = (window as any as AppWindow).mainApi;
      mainApi.setPobProxySupported(this.pobProxySupported)
        .catch(err => {
          console.log(err);
        }).finally(() => {
          this.ipcLocked = false;
        });
    },
    resetPob() {
      if (this.ipcLocked) {
        return;
      }
      this.ipcLocked = true;
      const mainApi = (window as any as AppWindow).mainApi;
      mainApi.resetPob()
        .catch(err => {
          console.log(err);
        }).finally(() => {
          this.ipcLocked = false;
        });
    }
  },
};
</script>

<style scoped>
.header-container {
  border-bottom: 1px solid #dddddd;
}

.header {
  margin: 0 20px;
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

.details-container {
  margin: 20px;
}

.details-section {
  margin-bottom: 10px;
}

.section-lines {
  padding: 3px;
  background-color: #eeeeee;
  border-radius: 3px;
}

.section-lines>.line {
  display: flex;
  justify-content: space-between;
  padding: 5px 10px;
  border-radius: 3px;
}

.section-lines>.line:hover {
  background-color: #cccccc;
}

.section-lines>.line>.line-left {
  display: flex;
}

.section-lines>.line>.line-right {
  vertical-align: bottom;
}

.section-lines>.line>.line-right>button {
  display: inline;
  margin-left: 10px;
}

.line .material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
  position: relative;
  top: 2px;
  line-height: 16px;
}

.tooltip-container {
  max-width: 200px;
  font-size: 12px;
}
</style>
