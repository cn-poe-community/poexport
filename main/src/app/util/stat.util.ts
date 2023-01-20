export class StatUtil {
    public static getBodyOfTemplate(zhTemplate: string): string {
        let body = zhTemplate.substring(1, zhTemplate.length - 1).replace(/\\\+/g, "").replace(/\(\\S\+\)/g, "#");
        return this.getBodyOfModifier(body);
    }

    public static getBodyOfModifier(mod: string): string {
        let buf = [];
        let pattern = /(?<=(^|\s|：))[+-]?[\d&&\.]+(?=%?($|\s))/g;
        let len = mod.length;
        let lastIndex = 0;

        while (true) {
            let matches = pattern.exec(mod);
            if (matches) {
                let index = matches.index;
                if (lastIndex !== index) {
                    buf.push(mod.substring(lastIndex, index));
                }
                buf.push("#");
                lastIndex = pattern.lastIndex;
            } else {
                if (lastIndex < len) {
                    buf.push(mod.substring(lastIndex, len));
                }
                break;
            }
        }

        return buf.join("");
    }

    public static render(template: string, zhTemplate: string, zhMod: string): string | null {
        const args = new RegExp(zhTemplate).exec(zhMod);
        if (!args) {
            return null;
        }

        template = template.substring(1, template.length - 1).replace(/\\\+/g, "+");
        let buf = [];
        const pattern = /\(\S+\)/g;
        let len = template.length;
        let lastIndex = 0;
        let argIndex = 0;
        while (true) {
            let matches = pattern.exec(template);
            if (matches) {
                let index = matches.index;
                if (lastIndex !== index) {
                    buf.push(template.substring(lastIndex, index));
                }
                buf.push(args[argIndex + 1]);
                argIndex+=1;
                lastIndex = pattern.lastIndex;
            } else {
                if (lastIndex !== len) {
                    buf.push(template.substring(lastIndex, len));
                }
                break;
            }
        }
        if (buf.length > 0) {
            return buf.join("");
        }

        return null;
    }
}