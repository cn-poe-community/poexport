export interface Config {
    poeSessId: string;
    pobPath: string;
    port: number;
    pobProxySupported: boolean;
    language: Language;
}

export enum SessionStatus {
    OK,
    INVALID,
}
export enum PobStatus {
    OK,
    NEED_PATCH,
    NOT_FOUND,
}

export interface ExporterStatus {
    sessionStatus: SessionStatus;
    pobStatus: PobStatus;
    port: number;
}

export interface ElectronApi {
    openFolder: () => Promise<string | undefined>;
    showFolder: (folder: string) => Promise<void>;
}

export interface MainApi {
    getConfig: () => Promise<Config>;
    resetConfig: () => Promise<void>;
    setPoeSessId: (id: string) => Promise<void>;
    setPobPath: (path: string) => Promise<void>;
    setPobProxySupported: (isSupported: boolean) => Promise<void>;
    setLanguage: (language: Language) => Promise<void>;
    getExporterStatus: () => Promise<ExporterStatus>;
    patchPob: () => Promise<void>;
    resetPob: () => Promise<void>;
    translateItem: (content: string) => Promise<string>;
    checkForUpdates: () => Promise<UpdateInfo>;
}

export enum Channels {
    DIALOG_OPEN_FLOOR = "dialog:openFolder",
    DIALOG_SHOW_FLOOR = "dialog:showFolder",
    APP_GET_CONFIG = "app:getConfig",
    APP_RESET_CONFIG = "app:resetConfig",
    APP_SET_POE_SESS_ID = "app:setPoeSessId",
    APP_SET_POB_PATH = "app:setPobPath",
    APP_SET_POB_PROXY_SUPPORTED = "app:setPobProxySupported",
    APP_GET_EXPORTER_STATUS = "app:getExporterStatus",
    APP_PATCH_POB = "app:patchPob",
    APP_RESET_POB = "app:resetPob",
    APP_TRANSLATE_ITEM = "app:translateItem",
    APP_SET_LANGUAGE = "app:setLanguage",
    APP_CHECK_FOR_UPDATES = "app:checkForUpdates",
}

export interface AppWindow {
    mainApi: MainApi;
    electronApi: ElectronApi;
}

export type Language = "zh_CN" | "en_US";

export interface UpdateInfo {
    currVersion: string;
    latestVersion: string;
    title?: string;
    body?: string[];
}
