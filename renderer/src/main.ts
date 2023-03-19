import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import FloatingVue from "floating-vue";

import "./assets/main.css";
import "material-symbols/outlined.css";
import "floating-vue/dist/style.css";

createApp(App).use(createPinia()).use(FloatingVue).mount("#app");
