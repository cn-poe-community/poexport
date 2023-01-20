import * as http from "http";
import { Requester } from "./requester";
import { HttpError } from "./type/poe.type";

const GET_CHARACTERS = "/character-window/get-characters";
const VIEW_PROFILE = "/account/view-profile/";
const GET_PASSIVE_SKILLS = "/character-window/get-passive-skills";
const GET_ITEMS = "/character-window/get-items";

export class Exporter {
    private readonly pobPath: string;
    private readonly port: number;
    private readonly requester: Requester;
    private server: http.Server;

    constructor(pobPath: string, port: number, requester: Requester) {
        this.pobPath = pobPath;
        this.port = port;
        this.requester = requester;
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
                        console.log(`exporter: Server listening on ${server.address}`);
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
                for (let character of data) {
                    character.league = this.betterLeagueName(character.league);
                }

                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(JSON.stringify(data), "utf-8");
            }).catch(error => {
                res.writeHead((error as HttpError).status);
                res.end();
            });
    }

    handleViewProfile(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }) {
        const parts = req.url.split("/");
        const accountName = decodeURIComponent(parts[parts.length - 1]);
        this.requester.viewProfile(accountName)
            .then(data => {
                res.setHeader("Content-Type", "text/html; charset=UTF-8");
                res.writeHead(200);
                res.end(data);
            }).catch(error => {
                res.writeHead((error as HttpError).status);
                res.end();
            });
    }

    handleGetPassiveSkills(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const params = urlObj.searchParams;
        const accountName = params.get("accountName");
        const character = this.decodeCharacter(params.get("character"));
        const realm = params.get("realm");

        this.requester.getPassiveSkills(accountName, character, realm)
            .then(data => {
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(JSON.stringify(data));
            }).catch(error => {
                res.writeHead((error as HttpError).status);
                res.end();
            });
    }

    handleGetItems(req: http.IncomingMessage, res: http.ServerResponse<http.IncomingMessage> & { req: http.IncomingMessage; }) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const params = urlObj.searchParams;
        const accountName = params.get("accountName");
        const character = this.decodeCharacter(params.get("character"));
        const realm = params.get("realm");

        this.requester.getItems(accountName, character, realm)
            .then(data => {
                res.setHeader("Content-Type", "application/json");
                res.writeHead(200);
                res.end(JSON.stringify(data));
            }).catch(error => {
                res.writeHead((error as HttpError).status);
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
     * 社区版POB将UTF-8编码的中文角色名称视作一个ASCII字符串（每个byte视作一个字符），URI编码后，发送请求
     * 
     * server接受到请求后，进行URI解码，并使用语言相关的编码方案（JavaScript采用Unicode16）来编码字符（将每一个byte扩展为u16）
     * 
     * 因此需要对Unicode16字符串进行解码，将每一个16位截断为8位，再使用UTF-8解码为真实的字符串
     * 
     * @param u16codes 
     * @returns 
     */
    decodeCharacter(u16codes: string): string {
        let bytes = Buffer.alloc(u16codes.length);
        for (let i = 0; i < u16codes.length; i++) {
            // 使用charCode就行了，不需要使用codePoint
            const charCode = u16codes.charCodeAt(i);
            bytes[i] = charCode;
        }

        return bytes.toString("utf-8");
    }
}