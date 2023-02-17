import * as http from "http";
import { ConfigManager } from "./config";
import { JsonTranslator } from "./translator/json_translator";
import { Requester, HttpError } from "./requester";

const GET_CHARACTERS = "/character-window/get-characters";
const VIEW_PROFILE = "/account/view-profile/";
const GET_PASSIVE_SKILLS = "/character-window/get-passive-skills";
const GET_ITEMS = "/character-window/get-items";

export class Exporter {
    private port: number;
    private server: http.Server;

    private readonly requester: Requester;
    private readonly configManager: ConfigManager;
    private readonly jsonTranslator: JsonTranslator;

    constructor(requester: Requester, configManager: ConfigManager, jsonTranslator: JsonTranslator) {
        this.requester = requester;
        this.configManager = configManager;
        this.jsonTranslator = jsonTranslator;

        this.port = configManager.getConfig().port;

        this.start();
    }

    public start() {
        const server = http.createServer((req, res) => {
            const url = req.url;
            if (url.startsWith(GET_CHARACTERS)) {
                this.handleGetCharacters(req, res);
            } else if (url.startsWith(VIEW_PROFILE)) {
                this.handleViewProfile(req, res);
            } else if (url.startsWith(GET_PASSIVE_SKILLS)) {
                this.handleGetPassiveSkills(req, res);
            } else if (url.startsWith(GET_ITEMS)) {
                this.handleGetItems(req, res);
            } else {
                res.writeHead(404);
                res.end();
            }
        }).listen(this.port);

        server.on('error', (e) => {
            // @ts-ignore
            if (e.code === 'EADDRINUSE') {
                console.log(`exporter: Address 127.0.0.1:${this.port} in use, retrying...`);

                setTimeout(() => {
                    server.close();
                    server.listen(() => {
                        console.log(`exporter: Server listening on ${server.address()}`);
                        const addr = server.address();
                        if (typeof addr === "string") {
                            const parts = addr.split(":");
                            this.port = Number(parts[parts.length - 1]);
                        } else {
                            this.port = addr.port;
                        }

                        this.configManager.setPort(this.port);
                    });
                }, 1000);
            }
        });
    }

    handleGetCharacters(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const params = urlObj.searchParams;
        const accountName = params.get("accountName");
        const realm = params.get("realm");

        this.requester.getCharacters(accountName, realm)
            .then(data => {
                for (const character of data) {
                    character.league = this.betterLeagueName(character.league);
                }

                res.setHeader("content-type", "application/json");
                res.writeHead(200);
                res.write(JSON.stringify(data), "utf-8");
            }).catch(error => {
                res.writeHead((error as HttpError).status);
            }).finally(() => {
                res.end();
            });
    }

    handleViewProfile(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }) {
        const parts = req.url.split("/");
        const accountName = decodeURIComponent(parts[parts.length - 1]);
        this.requester.viewProfile(accountName)
            .then(data => {
                res.setHeader("content-type", "text/html; charset=UTF-8");
                res.writeHead(200);
                res.write(data);
            }).catch(error => {
                res.writeHead((error as HttpError).status);
            }).finally(() => {
                res.end();
            });
    }

    handleGetPassiveSkills(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }) {
        const urlObj = new URL(this.decodeURL(req.url), `http://${req.headers.host}`);
        const params = urlObj.searchParams;
        const accountName = params.get("accountName");
        const character = params.get("character");
        const realm = params.get("realm");

        this.requester.getPassiveSkills(accountName, character, realm)
            .then(data => {
                this.jsonTranslator.translatePassiveSkills(data);

                res.setHeader("content-type", "application/json");
                res.writeHead(200);
                res.write(JSON.stringify(data));
            }).catch(error => {
                res.writeHead((error as HttpError).status);
            }).finally(() => {
                res.end();
            });
    }

    handleGetItems(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }) {
        const urlObj = new URL(this.decodeURL(req.url), `http://${req.headers.host}`);
        const params = urlObj.searchParams;
        const accountName = params.get("accountName");
        const character = params.get("character");
        const realm = params.get("realm");

        this.requester.getItems(accountName, character, realm)
            .then(data => {
                this.jsonTranslator.translateItems(data);

                res.setHeader("content-type", "application/json");
                res.writeHead(200);
                res.write(JSON.stringify(data));
            }).catch(error => {
                res.writeHead((error as HttpError).status);
            }).finally(() => {
                res.end();
            });
    }

    betterLeagueName(league: string) {
        return league.replace("永久", "Standard")
            .replace("虚空", "Void")
            .replace("赛季", "")
            .replace("独狼", "SSF_")
            .replace("专家", "HC_")
            .replace("无情", "R_")
            .replace("（", "(")
            .replace("）", ")");
    }

    /**
     * 社区版POB将UTF-8编码的中文角色名称视作一个ASCII字符串（每个byte视作一个字符），拼接到URL中（未进行URI编码），发送请求
     * 
     * （没有研究国际服是怎么处理非ASCII字符的，但这是一个BUG）
     * 
     * node server接受到请求后，将ASCII字符串转换为本地编码的字符串，使用Unicode16来编码ASCII字符（将每一个byte扩展为uint16）
     * 
     * 因为我们面临两种情况：
     * 
     * - 使用浏览器访问时，中文使用UTF-8编码后再使用URI编码，node server能正常处理
     * - 使用POB访问时，中文使用UTF-8编码后，未使用URI编码而是拼接到URL中，node server不能正常处理
     * 
     * 解决办法是将Unicode16字符截断为ASCII，再使用UTF-8解码得到正确的字符串：
     * 
     * - 对于URI编码的URL，无影响，返回URL
     * - 对于拼接了中文的URL，非中文部分无影响，中文部分正确解码为中文，可以被URL类正确解析
     * 
     * 
     * @param url 
     * @returns 
     */
    decodeURL(url: string): string {
        const bytes = Buffer.alloc(url.length);
        for (let i = 0; i < url.length; i++) {
            // 非扩展Unicode16字符，使用charCodeAt，不需要使用codePointAt
            const charCode = url.charCodeAt(i);
            bytes[i] = charCode;
        }

        return bytes.toString("utf-8");
    }
}