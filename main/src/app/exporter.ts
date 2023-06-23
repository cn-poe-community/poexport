import * as http from "http";
import { ConfigManager } from "./config";
import { Requester, HttpError } from "./requester";
import { JsonTranslator } from "cn-poe-translator/dist/translator/json.translator";

const GET_CHARACTERS_URL = "/character-window/get-characters";
const VIEW_PROFILE_URL_PREFIX = "/account/view-profile/";
const GET_PASSIVE_SKILLS_URL = "/character-window/get-passive-skills";
const GET_ITEMS_URL = "/character-window/get-items";

export class Exporter {
    private port: number;

    constructor(
        private readonly requester: Requester,
        private readonly configManager: ConfigManager,
        private readonly jsonTranslator: JsonTranslator
    ) {
        this.port = configManager.getConfig().port;

        this.start();
    }

    public start() {
        const server = http
            .createServer((req, res) => {
                const url = req.url;
                if (url.startsWith(GET_CHARACTERS_URL)) {
                    this.handleGetCharacters(req, res);
                } else if (url.startsWith(VIEW_PROFILE_URL_PREFIX)) {
                    this.handleViewProfile(req, res);
                } else if (url.startsWith(GET_PASSIVE_SKILLS_URL)) {
                    this.handleGetPassiveSkills(req, res);
                } else if (url.startsWith(GET_ITEMS_URL)) {
                    this.handleGetItems(req, res);
                } else {
                    res.writeHead(404);
                    res.end();
                }
            })
            .listen(this.port);

        server.on("error", (e) => {
            // address is in use, see server.listen doc for detail
            if ((e as unknown as { code: string }).code === "EADDRINUSE") {
                console.log(
                    `exporter: Address 127.0.0.1:${this.port} in use, retrying...`
                );

                setTimeout(() => {
                    server.close();
                    server.listen(() => {
                        console.log(
                            `exporter: Server listening on ${server.address()}`
                        );
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

    handleGetCharacters(
        req: http.IncomingMessage,
        res: http.ServerResponse<http.IncomingMessage> & {
            req: http.IncomingMessage;
        }
    ) {
        const urlObj = new URL(req.url, `http://${req.headers.host}`);
        const params = urlObj.searchParams;
        const accountName = params.get("accountName");
        const realm = params.get("realm");

        this.requester
            .getCharacters(accountName, realm)
            .then((data) => {
                for (const character of data) {
                    character.league = this.translateLeague(character.league);
                }

                res.setHeader("content-type", "application/json");
                res.writeHead(200);
                res.write(JSON.stringify(data), "utf-8");
            })
            .catch((error) => {
                res.writeHead((error as HttpError).status);
            })
            .finally(() => {
                res.end();
            });
    }

    handleViewProfile(
        req: http.IncomingMessage,
        res: http.ServerResponse<http.IncomingMessage> & {
            req: http.IncomingMessage;
        }
    ) {
        const parts = req.url.split("/");
        const accountName = decodeURIComponent(parts[parts.length - 1]);
        this.requester
            .viewProfile(accountName)
            .then((data) => {
                res.setHeader("content-type", "text/html; charset=UTF-8");
                res.writeHead(200);
                res.write(data);
            })
            .catch((error) => {
                res.writeHead((error as HttpError).status);
            })
            .finally(() => {
                res.end();
            });
    }

    handleGetPassiveSkills(
        req: http.IncomingMessage,
        res: http.ServerResponse<http.IncomingMessage> & {
            req: http.IncomingMessage;
        }
    ) {
        const urlObj = new URL(
            this.decodeUtf8Component(req.url),
            `http://${req.headers.host}`
        );
        const params = urlObj.searchParams;
        const accountName = params.get("accountName");
        const character = params.get("character");
        const realm = params.get("realm");

        this.requester
            .getPassiveSkills(accountName, character, realm)
            .then((data) => {
                this.jsonTranslator.translatePassiveSkills(data);

                res.setHeader("content-type", "application/json");
                res.writeHead(200);
                res.write(JSON.stringify(data));
            })
            .catch((error) => {
                res.writeHead((error as HttpError).status);
            })
            .finally(() => {
                res.end();
            });
    }

    handleGetItems(
        req: http.IncomingMessage,
        res: http.ServerResponse<http.IncomingMessage> & {
            req: http.IncomingMessage;
        }
    ) {
        const urlObj = new URL(
            this.decodeUtf8Component(req.url),
            `http://${req.headers.host}`
        );
        const params = urlObj.searchParams;
        const accountName = params.get("accountName");
        const character = params.get("character");
        const realm = params.get("realm");

        this.requester
            .getItems(accountName, character, realm)
            .then((data) => {
                this.jsonTranslator.translateItems(data);

                res.setHeader("content-type", "application/json");
                res.writeHead(200);
                res.write(JSON.stringify(data));
            })
            .catch((error) => {
                res.writeHead((error as HttpError).status);
            })
            .finally(() => {
                res.end();
            });
    }

    private static readonly LEAGUE_NAME_SEGMENT_MAPPRINGS: Map<string, string> =
        new Map([
            ["永久", "Standard"],
            ["虚空", "Void"],
            ["赛季", ""],
            ["季前赛", "Pre"],
            ["独狼", "SSF_"],
            ["专家", "HC_"],
            ["无情", "R_"],
            ["（", "("],
            ["）", ")"],
        ]);

    /**
     * Translate chinese league to english league.
     */
    translateLeague(league: string) {
        return league.replace(
            /永久|虚空|赛季|季前赛|独狼|专家|无情|（|）/g,
            (match) => Exporter.LEAGUE_NAME_SEGMENT_MAPPRINGS.get(match)
        );
    }

    /**
     * Pob cannot recognize UTF8-encoded character names and treats character names as ASCII strings.
     */
    decodeUtf8Component(url: string): string {
        const bytes = Buffer.alloc(url.length);
        for (let i = 0; i < url.length; i++) {
            const charCode = url.charCodeAt(i);
            bytes[i] = charCode;
        }

        return bytes.toString("utf-8");
    }
}
