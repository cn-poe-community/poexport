import { defineStore } from 'pinia';
import type { ExporterStatus } from '../../../ipc/types';

export const useStatusStore = defineStore('status', {
    state: (): ExporterStatus => ({
        pobStatus: 'Ok',
        sessionStatus: 'Ok',
        port: 0,
    }),
    getters: {
    },
    actions: {},
});
