import axios from "axios";

const TEST_URL = "https://poe.game.qq.com/trade";
const GET_CHARACTERS_URL =
    "https://poe.game.qq.com/character-window/get-characters";
const VIEW_PROFILE_URL_PREFIX = "https://poe.game.qq.com/account/view-profile/";
const GET_PASSIVE_SKILLS_URL =
    "https://poe.game.qq.com/character-window/get-passive-skills";
const GET_ITEMS_URL = "https://poe.game.qq.com/character-window/get-items";

/**
 * POE API requester
 */
export class Requester {
    private session: string;

    constructor(session: string) {
        this.session = session;
    }

    /**
     * 检查session有效性
     * @param session
     * @returns session有效性。因网络故障、服务器维护等导致的检测失败，归类为无效。
     */
    public static async isEffectiveSession(session: string): Promise<boolean> {
        try {
            await axios.get(TEST_URL, {
                maxRedirects: 0,
                headers: {
                    Cookie: `POESESSID=${session}`,
                },
            });
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * 测试POESESSID是否有效。
     *
     * @returns 包装结果的Promise。如果有效，结果为true；否则为false。
     */
    public async isEffectiveSession(): Promise<boolean> {
        return Requester.isEffectiveSession(this.session);
    }

    /**
     * 获取角色列表信息。
     *
     * @param accountName 用户名
     * @param realm
     * @returns 包装结果的Promise。请求成功，结果为json数据；请求失败，抛出值为http error code的Error。
     */
    public async getCharacters(
        accountName: string,
        realm: string
    ): Promise<Array<Character>> {
        const form = new URLSearchParams();
        form.append("accountName", accountName);
        form.append("realm", realm);

        try {
            const res = await axios.post(GET_CHARACTERS_URL, form, {
                headers: {
                    Cookie: `POESESSID=${this.session}`,
                },
            });

            return res.data;
        } catch (error) {
            throw new HttpError(error.response.status);
        }
    }

    public async viewProfile(accountName: string): Promise<string> {
        const url = `${VIEW_PROFILE_URL_PREFIX}${encodeURIComponent(
            accountName
        )}`;
        try {
            const res = await axios.get(url, {
                headers: {
                    Cookie: `POESESSID=${this.session}`,
                },
            });

            return res.data;
        } catch (error) {
            throw new HttpError(error.response.status);
        }
    }

    public async getPassiveSkills(
        accountName: string,
        character: string,
        realm: string
    ): Promise<PassiveSkills> {
        const form = new URLSearchParams();
        form.append("accountName", accountName);
        form.append("character", character);
        form.append("realm", realm);

        try {
            const res = await axios.post(GET_PASSIVE_SKILLS_URL, form, {
                headers: {
                    Cookie: `POESESSID=${this.session}`,
                },
            });
            return res.data;
        } catch (error) {
            throw new HttpError(error.response.status);
        }
    }

    public async getItems(
        accountName: string,
        character: string,
        realm: string
    ): Promise<Items> {
        const form = new URLSearchParams();
        form.append("accountName", accountName);
        form.append("character", character);
        form.append("realm", realm);

        try {
            const res = await axios.post(GET_ITEMS_URL, form, {
                headers: {
                    Cookie: `POESESSID=${this.session}`,
                },
            });
            return res.data;
        } catch (error) {
            throw new HttpError(error.response.status);
        }
    }

    public setSession(session: string) {
        this.session = session;
    }
}

/**
 *
 */
export class HttpError extends Error {
    status: number;

    constructor(status: number) {
        super(status.toString());
        this.status = status;
    }
}

interface Character {
    class: string;
    name: string;
    league: string;
}

interface PassiveSkills {
    items: Array<unknown>;
}

interface Items {
    items: Array<unknown>;
}