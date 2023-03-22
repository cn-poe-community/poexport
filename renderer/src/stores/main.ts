import {
    PobStatus,
    SessionStatus,
    type Config,
    type ExporterStatus,
} from "@/ipc/types";
import { defineStore } from "pinia";

export const useStatusStore = defineStore("status", {
    state: (): ExporterStatus => ({
        pobStatus: PobStatus.OK,
        sessionStatus: SessionStatus.OK,
        port: 0,
    }),
    getters: {},
    actions: {},
});

export const useInputsStore = defineStore("inputs", {
    state: () => ({
        poeAccountName: "",
        textItem: "",
        textItemTranlation: "",
    }),
});

export const useConfigStore = defineStore("config", {
    state: (): Config => ({
        poeSessId: "",
        pobPath: "",
        port: 8655,
        pobProxySupported: false,
        language: "zh_CN",
    }),
});
