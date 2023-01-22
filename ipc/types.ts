export type IPCError = string;

export interface Config {
    poeSessId: string,
    pobPath: string,
    port: number,
}

export type SessionStatus = "ok" | "invalid";
export type PobStatus = "ok" | "NeedPatch" | "NotFound";

export interface ExporterStatus {
    sessionStatus: SessionStatus,
    pobStatus: PobStatus,
}

export interface ElectronAPI {
    openFolder: () => Promise<string | undefined>
}

export interface MainAPI {
    getConfig: () => Promise<Config>,
    setConfig: (config: Config) => Promise<IPCError | undefined>,
    getExporterStatus: () => Promise<ExporterStatus>,
    patchPob: () => Promise<void>,
}