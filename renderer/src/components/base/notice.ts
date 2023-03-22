import vuetify from "../../../plugins/vuetify";
import { createApp } from "vue";
import Notice from "./Notice.vue";

export function notifyError(message: string) {
    notify("error", message);
}

export function notifyInfo(message: string) {
    notify("info", message);
}

export function notifySuccess(message: string) {
    notify("success", message);
}

let parent: HTMLDivElement = null!;
function notify(type: "error" | "info" | "success", message: string) {
    if (!parent) {
        parent = document.createElement("div");
        document.body.appendChild(parent);
    }

    const container = document.createElement("div");
    parent.appendChild(container);
    const app = createApp(Notice, { type: type, message }).use(vuetify);
    app.mount(container);
    if (type === "error") {
        container.addEventListener("closeNotice", () => {
            app.unmount();
            parent.removeChild(container);
        });
    } else {
        setTimeout(() => {
            app.unmount();
            parent.removeChild(container);
        }, 800);
    }
}
