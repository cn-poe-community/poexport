export type IPCError = string;

export interface Config {
    poeSessId: string,
    pobPath: string,
}

export interface ElectronAPI {
    openFolder: () => Promise<string | undefined>
}

export interface MainAPI {
    getConfig: () => Promise<Config>,
    setConfig: (config: Config) => Promise<IPCError | undefined>,
}