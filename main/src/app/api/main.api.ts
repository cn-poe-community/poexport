import { IpcMainEvent } from "electron";
import { Config } from "../../../../ipc/types";

export function handleGetConfig(): Config {
    return {
        poeSessId: "123",
        pobPath: "c:/",
    }
}

export function handleSetConfig(event: IpcMainEvent, config: Config): string | undefined {
    console.log(`debug: handleSetConfig received ${config.poeSessId}, ${config.pobPath}`);
    return;
}