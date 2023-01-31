<template>
  <div class="container">
    <div class="status">
      <header>
        <h2>状态</h2>
        <span class="material-symbols-outlined pointer refresh" @click="refresh">refresh</span>
      </header>
      <div class="line">
        <span class="line-content">
          <span class="line-left">POESESSID</span>
          <span class="line-right">
            <span class="material-symbols-outlined ok" v-if="status.sessionStatus === 'Ok'">check_circle</span>
            <span class="material-symbols-outlined error" v-else>error</span>
          </span>
        </span>
      </div>
      <div class="line">
        <span class="line-content">
          <span class="line-left">POB</span>
          <span class="line-right">
            <span class="material-symbols-outlined ok" v-if="status.pobStatus === 'Ok'">check_circle</span>
            <span class="update pointer" v-else-if="status.pobStatus === 'NeedPatch'" @click="patch">更新</span>
            <span class="material-symbols-outlined warning" v-else>error</span>
          </span>
        </span>
      </div>
      <div class="line">
        <span class="line-content">
          <span class="line-left">监听端口</span>
          <span class="line-right">{{ status.port }}</span>
        </span>
      </div>
    </div>
    <div class="encoder">
      <h2>URI 编码</h2>
      <div class="line">
        <span class="line-content">
          <input placeholder="论坛账户名" v-model="poeAccountName" />
          <button @click="encode" :disabled="poeAccountName === ''">编码</button>
        </span>
      </div>
      <div class="line">
        <span class="line-content">
          <input placeholder="编码结果" v-model="encodedValue" disabled />
          <button :disabled="encodedValue === ''" @click="copyEncodedValue">复制</button>
        </span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import type { MainAPI } from "../../../ipc/types";
import { useStatusStore } from '@/stores/main';

export default {
  setup() {
    const status = useStatusStore();

    return {
      status,
    }
  },
  data() {
    return {
      poeAccountName: "",
      encodedValue: "",
    };
  },
  mounted() {
    this.loadStatus();
  },
  methods: {
    encode() {
      const input = this.poeAccountName;
      if (input) {
        this.encodedValue = encodeURIComponent(input);
      } else {
        this.encodedValue = "";
      }
    },

    copyEncodedValue() {
      navigator.clipboard.writeText(this.encodedValue);
    },

    patch() {
      // @ts-ignore
      const mainAPI = window.mainAPI as MainAPI;
      mainAPI
        .patchPob()
        .then(() => {
          this.loadStatus();
        })
        .catch((err) => {
          console.log(err);
        });
    },
    loadStatus() {
      // @ts-ignore
      const mainAPI = window.mainAPI as MainAPI;
      mainAPI.getExporterStatus().then(status => {
        this.status.$patch(status);
      }).catch(err => {
        console.log(err);
      });
    },
    refresh(event: MouseEvent) {
      const target = event.target as HTMLElement;
      target.classList.add('refresh-start');
      // @ts-ignore
      const mainAPI = window.mainAPI as MainAPI;
      mainAPI.getExporterStatus().then(status => {
        this.status.$patch(status);
      }).catch(err => {
        console.log(err);
      }).finally(() => {
        target.classList.remove('refresh-start');
      });
    }
  },
};
</script>

<style scoped>
.container {
  width: 420px;
  margin: 0 auto;
}

h2 {
  margin-left: 10px;
}

.container>div:nth-child(n+2) {
  margin-top: 30px;
  border-top: 1px solid #dddddd;
}

.line {
  font-size: 16px;
  line-height: 28px;
}

.line-content {
  padding: 0 10px;
  display: flex;
}

.status>header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.status>header>h1 {
  display: inline-block;
}

.status>header>.refresh {
  margin-right: 10px;
  color: #111111;
}

@keyframes rotate {

  from {
    transform: rotate(0deg)
  }

  to {
    transform: rotate(360deg)
  }

}

.refresh-start {
  animation-name: rotate;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: linear;
  animation-play-state: running;

}

.status .line:hover {
  background-color: #f5f5f5;
}

.status .line-content {
  justify-content: space-between;
  align-items: center;
}

.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 300, 'GRAD' 0, 'opsz' 20;
  position: relative;
  top: 5px;
  line-height: 16px;
}

.update {
  vertical-align: top;
  border-bottom: 1px dashed;
  color: red;
}

.encoder .line {
  margin: 5px 0;
}

.encoder button {
  margin-left: 5px;
}
</style>
