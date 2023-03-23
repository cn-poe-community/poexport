import axios from "axios";
import { app } from "electron";
import { UpdateInfo } from "../ipc/types";

const GET_LAST_RELEASE_URL =
    "https://api.github.com/repos/me1ting/poe-cn-export/releases/latest";

interface Release {
    body: string;
    tag_name: string;
    name: string;
}

export async function checkForUpdates(): Promise<UpdateInfo> {
    const currVersion = app.getVersion();
    const release = await getLastRelease();
    const lines = release.body.trim().split("\r\n");
    return {
        currVersion,
        latestVersion: getVersionFromTag(release.tag_name),
        title: release.name,
        body: lines,
    };
}

function getVersionFromTag(tag: string) {
    if (tag.startsWith("v")) {
        return tag.substring(1);
    }
    return tag;
}

async function getLastRelease(): Promise<Release> {
    try {
        const res = await axios.get(GET_LAST_RELEASE_URL);

        return res.data as Release;
    } catch (error) {
        throw new Error(`failed_to_get_latest`);
    }
}
