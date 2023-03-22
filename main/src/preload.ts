// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { Channels } from "./ipc/types";

contextBridge.exposeInMainWorld("electronApi", {
    openFolder: () => ipcRenderer.invoke(Channels.DIALOG_OPEN_FLOOR),
    showFolder: (path: string) =>
        ipcRenderer.invoke(Channels.DIALOG_SHOW_FLOOR, path),
});

contextBridge.exposeInMainWorld("mainApi", {
    getConfig: () => ipcRenderer.invoke(Channels.APP_GET_CONFIG),
    resetConfig: () => ipcRenderer.invoke(Channels.APP_RESET_CONFIG),
    setPoeSessId: (id: string) =>
        ipcRenderer.invoke(Channels.APP_SET_POE_SESS_ID, id),
    setPobPath: (path: string) =>
        ipcRenderer.invoke(Channels.APP_SET_POB_PATH, path),
    setPobProxySupported: (isSupported: boolean) =>
        ipcRenderer.invoke(Channels.APP_SET_POB_PROXY_SUPPORTED, isSupported),
    setLanguage: (lang: boolean) =>
        ipcRenderer.invoke(Channels.APP_SET_LANGUAGE, lang),
    getExporterStatus: () =>
        ipcRenderer.invoke(Channels.APP_GET_EXPORTER_STATUS),
    patchPob: () => ipcRenderer.invoke(Channels.APP_PATCH_POB),
    resetPob: () => ipcRenderer.invoke(Channels.APP_RESET_POB),
    translateItem: (content: string) =>
        ipcRenderer.invoke(Channels.APP_TRANSLATE_ITEM, content),
});
