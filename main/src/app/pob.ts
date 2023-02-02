import fs from "node:fs/promises";
import path from "path";

const POB_IN_POECHARM = "PathOfBuilding-Community";
const POB_EXE_NAME = "Path of Building.exe";
const IMPORT_TAB_RELATIVE_PATH = "/Classes/ImportTab.lua";
const LAUNCH_RELATIVE_PATH = "Launch.lua";
const MANIFEST_RELATIVE_PATH = "manifest.xml";

const HOST_OF_TENCENT = "https://poe.game.qq.com/";
const HOST_OF_LOCAL_PATTERN = String.raw`http://localhost:\d{1,5}/`;

const PROXY_SUPPORTED_PATCH_LINES = `\tlocal proxy_url = self.proxyURL
\tif string.find(url, "^http://localhost") == 1 then
\t\tproxy_url = ""
\tend
\tlocal id = LaunchSubScript(script, "", "ConPrintf", url, params.header, params.body, self.connectionProtocol, proxy_url)`
    .replace("\r\n", "\n");

const PROXY_SUPPORTED_PATCH_TOKEN = `^http://localhost`;
const PROXY_SUPPORTED_PATCH_POSITION = `\tlocal id = LaunchSubScript(script, "", "ConPrintf", url, params.header, params.body, self.connectionProtocol, self.proxyURL)`;

const UNINITIALIZED_VERSION = "0.0.0";
/**
 * The class to manage pob.
 * 
 * You should create a new PobManager instance each time you use it.
 */
export class PobManager {
    private pobPath: string;
    private proxySupported: boolean;
    private port: number;
    private version: string;

    constructor(pobPath: string, proxySupported: boolean, port: number) {
        this.pobPath = pobPath;
        this.proxySupported = proxySupported;
        this.port = port;
        this.version = UNINITIALIZED_VERSION;
    }

    public async isNeededPatch(): Promise<boolean> {
        if (this.pobPath === "") {
            return false;
        }

        const isImportTabNeededPatch = await this.isImportTabNeededPatch();
        if (isImportTabNeededPatch) {
            return true;
        }

        if (this.proxySupported) {
            return this.isLaunchNeededPatch();
        }

        return false;
    }

    private async isImportTabNeededPatch(): Promise<boolean> {
        const proxy = `http://localhost:${this.port}/`;
        const importTabPath = path.join(this.pobPath, IMPORT_TAB_RELATIVE_PATH);

        let data: string;

        try {
            data = await fs.readFile(importTabPath, { encoding: "utf8" });
        } catch (err) {
            throw new Error(`read ImportTab.lua failed: ${err}`);
        }

        if (data.includes(proxy)) {
            return false;
        }

        return true;
    }

    private async isLaunchNeededPatch(): Promise<boolean> {
        const launchPath = path.join(this.pobPath, LAUNCH_RELATIVE_PATH);

        let data: string;
        try {
            data = await fs.readFile(launchPath, { encoding: "utf8" });
        } catch (err) {
            throw new Error(`read ${launchPath} failed: ${err}`);
        }

        if (data.includes(PROXY_SUPPORTED_PATCH_TOKEN)) {
            return false;
        }
        return true;
    }

    public async patch() {
        await this.patchImportTab();
        if (this.proxySupported) {
            await this.patchLaunch();
        }
    }

    private async patchImportTab() {
        const proxy = `http://localhost:${this.port}/`;
        const importTabPath = path.join(this.pobPath, IMPORT_TAB_RELATIVE_PATH);

        let data: string;
        try {
            data = await fs.readFile(importTabPath, { encoding: "utf8" });
        } catch (err) {
            throw new Error(`read ${importTabPath} failed: ${err}`);
        }

        if (data.includes(proxy)) {
            return;
        }

        if (data.includes(HOST_OF_TENCENT)) {
            const version = await this.getPobVersion();
            if (version === "") {
                throw new Error(`get pob version failed`);
            }
            const backupPath = `${importTabPath}.${version}`;
            try {
                await fs.writeFile(backupPath, data);
            } catch (err) {
                throw new Error(`write ${backupPath} failed: ${err}`);
            }

            try {
                await fs.writeFile(importTabPath, data.replace(HOST_OF_TENCENT, proxy));
            } catch (err) {
                throw new Error(`write ${importTabPath} failed: ${err}`);
            }
        } else {
            const re = new RegExp(HOST_OF_LOCAL_PATTERN);
            try {
                await fs.writeFile(importTabPath, data.replace(re, proxy));
            } catch (err) {
                throw new Error(`write ${importTabPath} failed: ${err}`);
            }
        }
    }

    private async patchLaunch() {
        const launchPath = path.join(this.pobPath, LAUNCH_RELATIVE_PATH);

        let data: string;
        try {
            data = await fs.readFile(launchPath, { encoding: "utf8" });
        } catch (err) {
            throw new Error(`read ${launchPath} failed: ${err}`);
        }

        if (data.includes(PROXY_SUPPORTED_PATCH_TOKEN)) {
            return;
        }

        if (data.includes(PROXY_SUPPORTED_PATCH_POSITION)) {
            const version = await this.getPobVersion();
            if (version === "") {
                throw new Error(`get pob version failed`);
            }
            const backupPath = `${launchPath}.${version}`;

            try {
                await fs.writeFile(backupPath, data);
            } catch (err) {
                throw new Error(`write ${backupPath} failed: ${err}`);
            }

            try {
                await fs.writeFile(launchPath, data.replace(PROXY_SUPPORTED_PATCH_POSITION, PROXY_SUPPORTED_PATCH_LINES));
            } catch (err) {
                throw new Error(`write ${launchPath} failed: ${err}`);
            }
        }
    }

    /**
     * Get pob version.
     * 
     * @returns string The version string. If can't get version for some reasons, return "".
     */
    private async getPobVersion(): Promise<string> {
        if (this.version !== UNINITIALIZED_VERSION) {
            return this.version;
        }

        this.version = "";

        if (this.pobPath === "") {
            return this.version;
        }

        const manifestPath = path.join(this.pobPath, MANIFEST_RELATIVE_PATH);
        let data: string;
        try {
            data = await fs.readFile(manifestPath, { encoding: "utf8" });
        } catch (err) {
            return this.version;
        }

        const pattern = /<Version number="([\d\.]+)"/g;
        const matches = pattern.exec(data);
        if (matches) {
            this.version = matches[1];
        }

        return this.version;
    }

    public async resetPob() {
        const version = await this.getPobVersion();
        if (version === "") {
            throw new Error(`get pob version failed`);
        }
        const importTabPath = path.join(this.pobPath, IMPORT_TAB_RELATIVE_PATH);
        const launchPath = path.join(this.pobPath, LAUNCH_RELATIVE_PATH);
        const importTabBackupPath = `${importTabPath}.${version}`;
        const launchBackupPath = `${launchPath}.${version}`;

        try {
            await fs.copyFile(importTabBackupPath, importTabPath);
            await fs.copyFile(launchBackupPath, launchPath);
        } catch (err) {
            //TODO: add a better handle way
            throw new Error(`reset pob failed: ${err}`);
        }
    }

    /**
     * Get the full path of the root of POB.
     * 
     * @param fullPath the full path of input
     * @returns the full path of the root of POB. If pob is not found, return "".
     */
    public static async getRoot(fullPath: string): Promise<string> {
        try {
            const files = await fs.readdir(fullPath);
            for (const file of files) {
                if (file.endsWith(POB_IN_POECHARM)) {
                    return this.getRoot(path.join(fullPath, file));
                }

                if (file.endsWith(POB_EXE_NAME)) {
                    return fullPath;
                }
            }

            return "";
        } catch (err) {
            return "";
        }
    }
}