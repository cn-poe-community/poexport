import { app } from "electron";
import path from "path";
import fs from "fs";
import { Config } from "../../../ipc/types";

const CONFIG_NAME = "config.json";
const DEFAULT_LISTENING_PORT = 8655;

export class ConfigManager {
    private config: Config;
    private configFullPath: string;

    constructor() {
        this.loadConfig();
    }

    private loadConfig() {
        const userDataPath = app.getPath('userData');
        this.configFullPath = path.join(userDataPath, CONFIG_NAME);

        if (fs.existsSync(this.configFullPath)) {
            const data = fs.readFileSync(this.configFullPath, "utf-8");
            this.config = JSON.parse(data);
        } else {
            this.config = {
                poeSessId: "",
                pobPath: "",
                port: DEFAULT_LISTENING_PORT,
            };
            this.saveConfig();
        }
    }

    private saveConfig() {
        fs.writeFile(this.configFullPath, JSON.stringify(this.config), (err) => {
            throw err;
        });
    }

    public getConfig(): Config {
        return Object.assign({}, this.config);
    }

    public setConfig(config: Config) {
        Object.assign(this.config, config);

        this.saveConfig();
    }

    public setPort(port: number) {
        this.config.port = port;

        fs.writeFile(this.configFullPath, JSON.stringify(this.config), (err) => {
            throw err;
        });
    }
}