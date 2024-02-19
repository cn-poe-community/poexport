import Assets from "cn-poe-export-db";
import { BasicTranslatorFactory } from "cn-poe-translator";

export function translateItems(items: any): string {
    const factory = new BasicTranslatorFactory(Assets);
    const jsonTranslator = factory.getJsonTranslator();
    jsonTranslator.translateItems(items);
    return JSON.stringify(items);
}

export function translatePassiveSkills(passiveSkills: any): string {
    const factory = new BasicTranslatorFactory(Assets);
    const jsonTranslator = factory.getJsonTranslator();
    jsonTranslator.translatePassiveSkills(passiveSkills);
    return JSON.stringify(passiveSkills);
}

export function translateItemText(item: string): string {
    const factory = new BasicTranslatorFactory(Assets);
    const textTranslator = factory.getTextTranslator();
    return textTranslator.translate(item);
}
