import { BaseTypeProvider } from "./translator/provider/basetype.provider";
import { CharacterProvider } from "./translator/provider/character.provider";
import { GemProvider } from "./translator/provider/gem.provider";
import { PassiveSkillProvider } from "./translator/provider/passiveskill.provider";
import { PropertyProvider } from "./translator/provider/property.provider";
import { RequirementProvider } from "./translator/provider/requirement.provider";
import { StatProvider } from "./translator/provider/stat.provider";
import { BaseTypeService } from "./translator/service/basetype.service";
import { CharacterService } from "./translator/service/character.service";
import { GemService } from "./translator/service/gem.service";
import { ItemService } from "./translator/service/item.service";
import { PassiveSkillService } from "./translator/service/passiveskill.service";
import { PropertyService } from "./translator/service/property.service";
import { RequirementSerivce } from "./translator/service/requirement.service";
import { StatService } from "./translator/service/stat.service";

import { ConfigManager } from "./config";
import { Exporter } from "./exporter";
import { PobManager } from "./pob";
import { Requester } from "./requester";
import { JsonTranslator } from "./translator/json_translator";
import { TextTranslator } from "./translator/text_translator";

import { Channels, Config, ExporterStatus } from "../../../ipc/types";
import { dialog, ipcMain } from "electron";

export class App {
    private exporter: Exporter;
    private configManager: ConfigManager;
    private requester: Requester;
    private jsonTranslator: JsonTranslator;
    private textTranslator: TextTranslator;

    constructor() {
    }

    public init() {
        this.initTranslators();

        this.configManager = new ConfigManager();
        const config = this.configManager.getConfig();
        this.requester = new Requester(config.poeSessId);
        this.exporter = new Exporter(this.requester, this.configManager, this.jsonTranslator);

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

    private async getExporterStatus(): Promise<ExporterStatus> {
        const config = this.configManager.getConfig();

        const status: ExporterStatus = {
            sessionStatus: "Ok",
            pobStatus: "Ok",
            port: 0,
        };

        const isEffective = await this.requester.isEffectiveSession();
        if (!isEffective) {
            status.sessionStatus = "Invalid";
        }

        const root = await PobManager.getRoot(config.pobPath);
        if (root === "") {
            status.pobStatus = "NotFound";
        } else {
            const config = this.getConfig();
            const pobManager = new PobManager(config.pobPath, config.pobProxySupported, config.port);
            let isNeededPatch: boolean;

            try {
                isNeededPatch = await pobManager.isNeededPatch();
            } catch (err) {
                throw new Error(`check pob status failed: ${err}`);
            }

            if (isNeededPatch) {
                status.pobStatus = "NeedPatch";
            }
        }

        status.port = this.configManager.getConfig().port;

        return status;
    }

    private async patchPob() {
        const config = this.getConfig();
        const pobManager = new PobManager(config.pobPath, config.pobProxySupported, config.port);
        return pobManager.patch();
    }

    private async resetPob() {
        const config = this.getConfig();
        const pobManager = new PobManager(config.pobPath, config.pobProxySupported, config.port);
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

    private async translateItem(content: string): Promise<string> {
        return this.textTranslator.translate(content);
    }

    public initTranslators() {
        const baseTypeProvider = new BaseTypeProvider();
        const baseTypeService = new BaseTypeService(baseTypeProvider);
        const itemService = new ItemService(baseTypeProvider);
        const requirementProvider = new RequirementProvider();
        const characterProvider = new CharacterProvider();
        const characterService = new CharacterService(characterProvider);
        const requirementService = new RequirementSerivce(requirementProvider, characterService);
        const propertyProvider = new PropertyProvider();
        const propertySerivce = new PropertyService(propertyProvider);
        const gemProvider = new GemProvider();
        const gemService = new GemService(gemProvider);
        const passiveSkillProvider = new PassiveSkillProvider();
        const passiveSkillService = new PassiveSkillService(passiveSkillProvider);
        const statProvider = new StatProvider();
        const statService = new StatService(passiveSkillService, statProvider);

        this.jsonTranslator = new JsonTranslator(
            baseTypeService, itemService, requirementService, propertySerivce, gemService, statService);
        this.textTranslator = new TextTranslator(
            baseTypeService, itemService, requirementService, propertySerivce, gemService, statService);
    }

    public initIPC() {
        ipcMain.handle(Channels.DIALOG_OPEN_FLOOR, () => this.handleOpenFolder());
        ipcMain.handle(Channels.APP_GET_CONFIG, () => this.getConfig());
        ipcMain.handle(Channels.APP_RESET_CONFIG, () => this.resetConfig());
        ipcMain.handle(Channels.APP_SET_POE_SESS_ID, (_, id) => { this.setPoeSessId(id) });
        ipcMain.handle(Channels.APP_SET_POB_PATH, (_, path) => { this.setPobPath(path) });
        ipcMain.handle(Channels.APP_SET_POB_PROXY_SUPPORTED, (_, isSupported) => { this.setPobProxySupported(isSupported) });
        ipcMain.handle(Channels.APP_GET_EXPORTER_STATUS, () => this.getExporterStatus());
        ipcMain.handle(Channels.APP_PATCH_POB, () => this.patchPob());
        ipcMain.handle(Channels.APP_RESET_POB, () => this.resetPob());
        ipcMain.handle(Channels.APP_TRANSLATE_ITEM, (_, content) => this.translateItem(content));
    }
}