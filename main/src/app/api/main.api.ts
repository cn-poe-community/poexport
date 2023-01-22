import { IpcMainEvent } from "electron";
import { Config, IPCError, ExporterStatus } from "../../../../ipc/types";

let handleGetConfigImpl: () => Config;
let handleSetConfigImpl: (config: Config) => Promise<IPCError | undefined>;
let handleGetExporterStatusImpl: () => Promise<ExporterStatus>;
let handlePatchPobImpl: () => Promise<void>;

export function initMainAPI(getConfig: () => Config,
    setConfig: (config: Config) => Promise<IPCError | undefined>,
    getExporterStatus: () => Promise<ExporterStatus>,
    patchPob: () => Promise<void>) {
    handleGetConfigImpl = getConfig;
    handleSetConfigImpl = setConfig;
    handleGetExporterStatusImpl = getExporterStatus;
    handlePatchPobImpl = patchPob;
}

export function handleGetConfig(): Config {
    return handleGetConfigImpl();
}

export function handleSetConfig(event: IpcMainEvent, config: Config): Promise<IPCError | undefined> {
    return handleSetConfigImpl(config);
}

export function handleGetExporterStatus(): Promise<ExporterStatus> {
    return handleGetExporterStatusImpl();
}

export function handlePatchPob(): Promise<void> {
    return handlePatchPobImpl();
}