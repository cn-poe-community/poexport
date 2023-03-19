export interface Config {
    poeSessId: string;
    pobPath: string;
    port: number;
    pobProxySupported: boolean;
}

export type SessionStatus = "Ok" | "Invalid";
export type PobStatus = "Ok" | "NeedPatch" | "NotFound";

export interface ExporterStatus {
    sessionStatus: SessionStatus;
    pobStatus: PobStatus;
    port: number;
}

export interface ElectronApi {
    openFolder: () => Promise<string | undefined>;
}

export interface MainApi {
    getConfig: () => Promise<Config>;
    resetConfig: () => Promise<void>;
    setPoeSessId: (id: string) => Promise<void>;
    setPobPath: (path: string) => Promise<void>;
    setPobProxySupported: (isSupported: boolean) => Promise<void>;
    getExporterStatus: () => Promise<ExporterStatus>;
    patchPob: () => Promise<void>;
    resetPob: () => Promise<void>;
    translateItem: (content: string) => Promise<string>;
}

export enum Channels {
    DIALOG_OPEN_FLOOR = "dialog:openFolder",
    APP_GET_CONFIG = "app:getConfig",
    APP_RESET_CONFIG = "app:resetConfig",
    APP_SET_POE_SESS_ID = "app:setPoeSessId",
    APP_SET_POB_PATH = "app:setPobPath",
    APP_SET_POB_PROXY_SUPPORTED = "app:setPobProxySupported",
    APP_GET_EXPORTER_STATUS = "app:getExporterStatus",
    APP_PATCH_POB = "app:patchPob",
    APP_RESET_POB = "app:resetPob",
    APP_TRANSLATE_ITEM = "app:translateItem",
}

export interface AppWindow {
    mainApi: MainApi;
    electronApi: ElectronApi;
}
