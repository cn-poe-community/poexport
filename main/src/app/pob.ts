import fs from "node:fs/promises";
import path from "path";

const POB_IN_POECHARM = "PathOfBuilding-Community";
const POB_NAME = "Path of Building.exe";
const IMPORT_TAB_IN_POB = "/Classes/ImportTab.lua";

const HOST_OF_TENCENT = "https://poe.game.qq.com/";
const HOST_OF_LOCAL_PATTERN = String.raw`http://localhost:\d{1,5}/`;

export class Pob {
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

                if (file.endsWith(POB_NAME)) {
                    return fullPath;
                }
            }

            return "";
        } catch (err) {
            return "";
        }
    }

    public static async isNeededPatch(root: string, port: number): Promise<boolean> {
        const proxy = `http://localhost:${port}/`;
        const importTabPath = path.join(root, IMPORT_TAB_IN_POB);

        try {
            const data = await fs.readFile(importTabPath, { encoding: "utf8" });
            if (data.includes(proxy)) {
                return false;
            }
            return true;
        } catch (err) {
            throw new Error(err);
        }
    }

    /**
     * Patch the pob using proxy api.
     * 
     * @param root the full root of pob
     * @param port local server listening port
     * @returns 
     */
    public static async patch(root: string, port: number) {
        const proxy = `http://localhost:${port}/`;
        const importTabPath = path.join(root, IMPORT_TAB_IN_POB);

        try {
            const data = await fs.readFile(importTabPath, { encoding: "utf8" });
            if (data.includes(proxy)) {
                return;
            }

            if (data.includes(HOST_OF_TENCENT)) {
                await fs.writeFile(importTabPath, data.replace(HOST_OF_TENCENT, proxy));
            } else {
                const re = new RegExp(HOST_OF_LOCAL_PATTERN);
                await fs.writeFile(importTabPath, data.replace(re, proxy));
            }
        } catch (err) {
            throw new Error(err);
        }
    }
}