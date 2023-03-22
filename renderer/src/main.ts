import { createApp } from "vue";
import App from "./App.vue";
import { createPinia } from "pinia";
import vuetify from "../plugins/vuetify";

import "./assets/main.css";

import { messages } from "./i18n/i18n";
import { createI18n } from "vue-i18n";
import type { Language } from "./ipc/types";

const locale: Language = "zh_CN";

const i18n = createI18n({
    legacy: false,
    locale,
    fallbackLocale: "en_US",
    messages,
});

createApp(App).use(createPinia()).use(i18n).use(vuetify).mount("#app");
