import { IpcMainEvent } from "electron";
import { Config, IPCError } from "../../../../ipc/types";

let handleGetConfigImpl: () => Config;
let handleSetConfigImpl: (config: Config) => Promise<IPCError | undefined>;

export function initMainAPI(getConfig: () => Config,
    setConfig: (config: Config) => Promise<IPCError | undefined>) {
    handleGetConfigImpl = getConfig;
    handleSetConfigImpl = setConfig;
}

export function handleGetConfig(): Config {
    return handleGetConfigImpl();
}

export function handleSetConfig(event: IpcMainEvent, config: Config): Promise<IPCError | undefined> {
    return handleSetConfigImpl(config);
}