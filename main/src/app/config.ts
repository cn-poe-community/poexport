import { app } from "electron";
import path from "path";
import fs from "fs";
import { Config } from "../../../ipc/types";

const CONFIG_NAME = "config.json";

export class ConfigManager {
    private config: Config;
    private configFullPath: string;

    constructor() {
        this.config = this.loadConfig();
    }

    private loadConfig(): Config {
        const userDataPath = app.getPath('userData');
        this.configFullPath = path.join(userDataPath, CONFIG_NAME);

        console.log(`debug: ${this.configFullPath}`);

        if (fs.existsSync(this.configFullPath)) {
            const data = fs.readFileSync(this.configFullPath, "utf-8");
            return JSON.parse(data);
        } else {
            return {
                poeSessId: "",
                pobPath: "",
            };
        }

    }

    public getConfig(): Config {
        return Object.assign({}, this.config);
    }

    public saveConfig(config: Config) {
        this.config.poeSessId = config.poeSessId;
        this.config.pobPath = config.pobPath;

        fs.writeFile(this.configFullPath, JSON.stringify(config), (err) => {
            throw err;
        });
    }
}