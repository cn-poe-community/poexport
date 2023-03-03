import { CharacterProvider } from "../provider/character.provider";

export class CharacterService {
    private readonly characterProvider: CharacterProvider;
    constructor(characterProvider: CharacterProvider) {
        this.characterProvider = characterProvider;
    }

    public translateClass(zh: string): string | undefined {
        return this.characterProvider.provideClasses().get(zh);
    }
}