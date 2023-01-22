// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from 'electron';
import { Config } from '../../ipc/types';

contextBridge.exposeInMainWorld('electronAPI', {
    openFolder: () => ipcRenderer.invoke('dialog:openFolder'),
});

contextBridge.exposeInMainWorld('mainAPI', {
    getConfig: () => ipcRenderer.invoke('app:getConfig'),
    setConfig: (config: Config) => ipcRenderer.invoke('app:setConfig', config),
    getExporterStatus: () => ipcRenderer.invoke('app:getExporterStatus'),
    patchPob: () => ipcRenderer.invoke('app:patchPob'),
});