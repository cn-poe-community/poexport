import { app } from "electron";
import path from "path";
import fs from "fs";
import { Config } from "../../../ipc/types";

const CONFIG_NAME = "config.json";
const DEFAULT_LISTENING_PORT = 8655;
const DEFAULT_CONFIG = {
    poeSessId: "",
    pobPath: "",
    port: DEFAULT_LISTENING_PORT,
    pobProxySupported: false,
};

export class ConfigManager {
    private config: Config;
    private configFullPath: string;

    constructor() {
        this.loadConfig();
    }

    private loadConfig() {
        const userDataPath = app.getPath('userData');
        this.configFullPath = path.join(userDataPath, CONFIG_NAME);

        this.config = Object.assign({}, DEFAULT_CONFIG);

        if (fs.existsSync(this.configFullPath)) {
            const data = fs.readFileSync(this.configFullPath, "utf-8");
            Object.assign(this.config, JSON.parse(data));
        } else {
            this.saveConfig();
        }
    }

    private saveConfig() {
        fs.writeFile(this.configFullPath, JSON.stringify(this.config), (err) => {
            if (err) {
                console.log(`write config error: ${err}`);
            }
        });
    }

    public getConfig(): Config {
        return Object.assign({}, this.config);
    }

    public setConfig(config: Config) {
        Object.assign(this.config, config);

        this.saveConfig();
    }

    public setPoeSessId(id: string) {
        if (id === this.config.poeSessId) {
            return;
        }
        this.config.poeSessId = id;
        this.saveConfig();
    }

    public setPobPath(path: string) {
        if (path === this.config.pobPath) {
            return;
        }
        this.config.pobPath = path;
        this.saveConfig();
    }

    public setPort(port: number) {
        if (port === this.config.port) {
            return;
        }
        this.config.port = port;
        this.saveConfig();
    }

    public setPobProxySupported(isSupported: boolean) {
        if (isSupported === this.config.pobProxySupported) {
            return;
        }

        this.config.pobProxySupported = isSupported;
        this.saveConfig();
    }

    public resetConfig() {
        this.config = Object.assign({}, DEFAULT_CONFIG);
        this.saveConfig();
    }
}