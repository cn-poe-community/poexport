import { createVuetify, type ThemeDefinition } from "vuetify";
import { md2 } from "vuetify/blueprints";
import "vuetify/styles";
import { aliases, mdi } from "vuetify/iconsets/mdi-svg";
import {
    mdiCheckCircleOutline,
    mdiAlertCircleOutline,
    mdiRefresh,
    mdiArrowRight,
    mdiCog,
} from "@mdi/js";

const lightTheme: ThemeDefinition = {
    dark: false,
    colors: {
        background: "#FFFFFF",
        surface: "#FFFFFF",
        primary: "#5B5C9D",
        "primary-darken-1": "#3700B3",
        secondary: "#9C27B0",
        "secondary-darken-1": "#018786",
        "text-secondary": "#909399",
        error: "#B00020",
        info: "#2196F3",
        success: "#4CAF50",
        warning: "#FB8C00",
    },
};

export default createVuetify({
    theme: {
        defaultTheme: "lightTheme",
        themes: {
            lightTheme,
        },
    },
    blueprint: md2,
    icons: {
        defaultSet: "mdi",
        aliases: {
            ...aliases,
            checkCircleOutline: mdiCheckCircleOutline,
            alertCircleOutline: mdiAlertCircleOutline,
            refresh: mdiRefresh,
            arrowRight: mdiArrowRight,
            cog: mdiCog,
        },
        sets: {
            mdi,
        },
    },
});
