import { CharacterProvider } from "../provider/character.provider";

export class CharacterService {
    private readonly characterProvider: CharacterProvider;
    constructor(characterProvider: CharacterProvider) {
        this.characterProvider = characterProvider;
    }

    public translateClass(zh: string): string | null {
        let res = this.characterProvider.provideClasses().get(zh);
        return res ? res : null;
    }
}