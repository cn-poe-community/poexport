import { ConfigManager } from "./config";
import { Exporter } from "./exporter";
import { Pob } from "./pob";
import { Requester } from "./requester";

import { Config, IPCError } from "../../../ipc/types";
import { initMainAPI } from "./api/main.api";


export class App {
    private exporter: Exporter;
    private configManager: ConfigManager;
    private requester: Requester;

    constructor() {
        this.configManager = new ConfigManager();
        const config = this.configManager.getConfig();
        this.requester = new Requester(config.poeSessId);
    }

    public init() {
        const that = this;
        initMainAPI(function (): Config {
            return that.getConfig();
        }, function (config: Config): Promise<IPCError | undefined> {
            return that.setConfig(config);
        });
    }

    private getConfig(): Config {
        return this.configManager.getConfig();
    }

    private async setConfig(config: Config): Promise<IPCError | undefined> {
        const old = this.configManager.getConfig();
        if (config.poeSessId === old.poeSessId && config.pobPath === old.pobPath) {
            return;
        }

        if (config.poeSessId !== old.poeSessId) {
            let isEffective = await Requester.isEffectiveSession(config.poeSessId);
            if (!isEffective) {
                return "invalid POESESSID";
            }
        }

        if (config.pobPath !== old.pobPath) {
            let fullPath = await Pob.getRoot(config.pobPath);
            if (fullPath === "") {
                return "invalid POB path";
            } else {
                config.pobPath = fullPath;
            }
        }

        if (config.poeSessId !== old.poeSessId) {
            this.requester = new Requester(config.poeSessId);
        }

        if (config.pobPath !== old.pobPath) {
            //TODO: update Exporter
        }

        this.configManager.saveConfig(config);
    }
}