import { BaseTypeProvider } from "./provider/basetype.provider";
import { CharacterProvider } from "./provider/character.provider";
import { GemProvider } from "./provider/gem.provider";
import { PassiveSkillProvider } from "./provider/passiveskill.provider";
import { PropertyProvider } from "./provider/property.provider";
import { RequirementProvider } from "./provider/requirement.provider";
import { StatProvider } from "./provider/stat.provider";
import { BaseTypeService } from "./service/basetype.service";
import { CharacterService } from "./service/character.service";
import { GemService } from "./service/gem.service";
import { ItemService } from "./service/item.service";
import { PassiveSkillService } from "./service/passiveskill.service";
import { PropertyService } from "./service/property.service";
import { RequirementSerivce } from "./service/requirement.service";
import { StatService } from "./service/stat.service";

import { ConfigManager } from "./config";
import { Exporter } from "./exporter";
import { Pob } from "./pob";
import { Requester } from "./requester";
import { JsonTranslator } from "./jsontranslator";

import { Config, ExporterStatus, IPCError } from "../../../ipc/types";
import { initMainAPI } from "./api/main.api";


export class App {
    private readonly baseTypeProvider: BaseTypeProvider;
    private readonly baseTypeService: BaseTypeService;
    private readonly itemService: ItemService;
    private readonly requirementProvider: RequirementProvider;
    private readonly characterProvider: CharacterProvider;
    private readonly characterService: CharacterService;
    private readonly requirementService: RequirementSerivce;
    private readonly propertyProvider: PropertyProvider;
    private readonly propertySerivce: PropertyService;
    private readonly gemProvider: GemProvider;
    private readonly gemService: GemService;
    private readonly passiveSkillProvider: PassiveSkillProvider;
    private readonly passiveSkillService: PassiveSkillService;
    private readonly statProvider: StatProvider;
    private readonly statService: StatService;

    private exporter: Exporter;
    private configManager: ConfigManager;
    private requester: Requester;
    private jsonTranslator: JsonTranslator;

    constructor() {
        this.baseTypeProvider = new BaseTypeProvider();
        this.baseTypeService = new BaseTypeService(this.baseTypeProvider);
        this.itemService = new ItemService(this.baseTypeProvider);
        this.requirementProvider = new RequirementProvider();
        this.characterProvider = new CharacterProvider();
        this.characterService = new CharacterService(this.characterProvider);
        this.requirementService = new RequirementSerivce(this.requirementProvider, this.characterService);
        this.propertyProvider = new PropertyProvider();
        this.propertySerivce = new PropertyService(this.propertyProvider);
        this.gemProvider = new GemProvider();
        this.gemService = new GemService(this.gemProvider);
        this.passiveSkillProvider = new PassiveSkillProvider();
        this.passiveSkillService = new PassiveSkillService(this.passiveSkillProvider);
        this.statProvider = new StatProvider();
        this.statService = new StatService(this.passiveSkillService, this.statProvider);

        this.jsonTranslator = new JsonTranslator(
            this.baseTypeService, this.itemService, this.requirementService, this.propertySerivce, this.gemService, this.statService);

        this.configManager = new ConfigManager();
        const config = this.configManager.getConfig();
        this.requester = new Requester(config.poeSessId);
        this.exporter = new Exporter(this.requester, this.configManager, this.jsonTranslator);
    }

    public init() {
        const that = this;
        initMainAPI(function (): Config {
            return that.getConfig();
        }, function (config: Config): Promise<IPCError | undefined> {
            return that.setConfig(config);
        }, function (): Promise<ExporterStatus> {
            return that.getExporterStatus();
        }, function (): Promise<void> {
            return that.patchPob();
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
            const isEffective = await Requester.isEffectiveSession(config.poeSessId);
            if (!isEffective) {
                return "invalid POESESSID";
            }
        }

        if (config.pobPath !== old.pobPath) {
            const fullPath = await Pob.getRoot(config.pobPath);
            if (fullPath === "") {
                return "invalid POB path";
            } else {
                config.pobPath = fullPath;
            }
        }

        if (config.poeSessId !== old.poeSessId) {
            this.requester.setSession(config.poeSessId);
        }

        //current version not support setting port from UI
        config.port = old.port;

        this.configManager.setConfig(config);
    }

    private async getExporterStatus(): Promise<ExporterStatus> {
        const config = this.configManager.getConfig();

        const status: ExporterStatus = {
            sessionStatus: "ok",
            pobStatus: "ok",
        };

        try {
            const isEffective = await this.requester.isEffectiveSession();
            if (!isEffective) {
                status.sessionStatus = "invalid";
            }

            const root = await Pob.getRoot(config.pobPath);
            if (root === "") {
                status.pobStatus = "NotFound";
            } else {
                const isNeededPatch = await Pob.isNeededPatch(root, config.port);
                if (isNeededPatch) {
                    status.pobStatus = "NeedPatch";
                }
            }
        } catch (err) {
            throw new Error(err);
        }

        return status;
    }

    private async patchPob(): Promise<void> {
        const config = this.getConfig();
        return Pob.patch(config.pobPath, config.port);
    }
}