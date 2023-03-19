import { classes } from "../asset/characters.json";
import { CharacterClass } from "../type/character.type";
import { Language } from "../type/language.type";

export class CharacterProvider {
    private readonly classesIndexByZhText = new Map<string, string>();

    constructor() {
        for (const c in classes) {
            const data = (classes as { [id: string]: CharacterClass })[
                c
            ] as CharacterClass;
            const zh = data.text[Language.CHINESE];
            this.classesIndexByZhText.set(zh, c);
        }
    }

    public provideClasses(): Map<string, string> {
        return this.classesIndexByZhText;
    }
}
