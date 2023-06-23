import { ConfigManager } from "./config";
import { Exporter } from "./exporter";
import { PobManager } from "./pob";
import { Requester } from "./requester";

import {
    Channels,
    Config,
    ExporterStatus,
    Language,
    PobStatus,
    SessionStatus,
} from "../ipc/types";
import { dialog, ipcMain, shell } from "electron";
import { checkForUpdates } from "./update";
import { TranslatorFactory, BasicTranslatorFactory } from "cn-poe-translator";
import { JsonTranslator } from "cn-poe-translator/dist/translator/json.translator";
import { TextTranslator } from "cn-poe-translator/dist/translator/text.translator";
import Assets from "cn-poe-export-db";

export class App {
    private exporter: Exporter;
    private configManager: ConfigManager;
    private requester: Requester;
    private jsonTranslator: JsonTranslator;
    private textTranslator: TextTranslator;

    public init() {
        this.initTranslators();

        this.configManager = new ConfigManager();
        const config = this.configManager.getConfig();
        this.requester = new Requester(config.poeSessId);
        this.exporter = new Exporter(
            this.requester,
            this.configManager,
            this.jsonTranslator
        );

        this.initIPC();
    }

    private getConfig(): Config {
        return this.configManager.getConfig();
    }

    private resetConfig() {
        this.configManager.resetConfig();
        const config = this.configManager.getConfig();
        this.requester.setSession(config.poeSessId);
    }

    private setPoeSessId(id: string) {
        this.requester.setSession(id);
        this.configManager.setPoeSessId(id);
    }

    private setPobPath(path: string) {
        this.configManager.setPobPath(path);
    }

    private setPobProxySupported(isSupported: boolean) {
        this.configManager.setPobProxySupported(isSupported);
    }

    private setLanguage(lang: Language) {
        this.configManager.setLanguage(lang);
    }

    private async getExporterStatus(): Promise<ExporterStatus> {
        const config = this.configManager.getConfig();

        const status: ExporterStatus = {
            sessionStatus: SessionStatus.OK,
            pobStatus: PobStatus.OK,
            port: 0,
        };

        const isEffective = await this.requester.isEffectiveSession();
        if (!isEffective) {
            status.sessionStatus = SessionStatus.INVALID;
        }

        const root = await PobManager.getRoot(config.pobPath);
        if (root === "") {
            status.pobStatus = PobStatus.NOT_FOUND;
        } else {
            const config = this.getConfig();
            const pobManager = new PobManager(
                config.pobPath,
                config.pobProxySupported,
                config.port
            );
            let isNeededPatch: boolean;

            try {
                isNeededPatch = await pobManager.isNeededPatch();
            } catch (err) {
                throw new Error(`check pob status failed: ${err}`);
            }

            if (isNeededPatch) {
                status.pobStatus = PobStatus.NEED_PATCH;
            }
        }

        status.port = this.configManager.getConfig().port;

        return status;
    }

    private async patchPob() {
        const config = this.getConfig();
        const pobManager = new PobManager(
            config.pobPath,
            config.pobProxySupported,
            config.port
        );
        return pobManager.patch();
    }

    private async resetPob() {
        const config = this.getConfig();
        const pobManager = new PobManager(
            config.pobPath,
            config.pobProxySupported,
            config.port
        );
        return pobManager.resetPob();
    }

    private async handleOpenFolder(): Promise<string | undefined> {
        const { canceled, filePaths } = await dialog.showOpenDialog({
            properties: ["openDirectory"],
        });
        if (canceled) {
            return;
        } else {
            return filePaths[0];
        }
    }

    private async handleShowFolder(path: string) {
        shell.showItemInFolder(path);
    }

    private async translateItem(content: string): Promise<string> {
        return this.textTranslator.translate(content);
    }

    public initTranslators() {
        const factory = new BasicTranslatorFactory(Assets);
        this.jsonTranslator = factory.getJsonTranslator();
        this.textTranslator = factory.getTextTranslator();
    }

    public initIPC() {
        ipcMain.handle(Channels.DIALOG_OPEN_FLOOR, () =>
            this.handleOpenFolder()
        );
        ipcMain.handle(Channels.DIALOG_SHOW_FLOOR, (event, path) =>
            this.handleShowFolder(path)
        );
        ipcMain.handle(Channels.APP_GET_CONFIG, () => this.getConfig());
        ipcMain.handle(Channels.APP_RESET_CONFIG, () => this.resetConfig());
        ipcMain.handle(Channels.APP_SET_POE_SESS_ID, (event, id) => {
            this.setPoeSessId(id);
        });
        ipcMain.handle(Channels.APP_SET_POB_PATH, (event, path) => {
            this.setPobPath(path);
        });
        ipcMain.handle(
            Channels.APP_SET_POB_PROXY_SUPPORTED,
            (event, isSupported) => {
                this.setPobProxySupported(isSupported);
            }
        );
        ipcMain.handle(Channels.APP_SET_LANGUAGE, (event, lang) => {
            this.setLanguage(lang);
        });
        ipcMain.handle(Channels.APP_GET_EXPORTER_STATUS, () =>
            this.getExporterStatus()
        );
        ipcMain.handle(Channels.APP_PATCH_POB, () => this.patchPob());
        ipcMain.handle(Channels.APP_RESET_POB, () => this.resetPob());
        ipcMain.handle(Channels.APP_TRANSLATE_ITEM, (event, content) =>
            this.translateItem(content)
        );
        ipcMain.handle(Channels.APP_CHECK_FOR_UPDATES, () => checkForUpdates());
    }
}
