import { expect, test } from "@jest/globals";
import { Template } from "../../../../src/app/translator/util/stat.util";

function testCreateTemplate() {
    const t = new Template("{1}% 的几率在击中敌人后获得怒火 +{0}");
    test(`t's segments are right`, () => {
        expect(t.segments[0]).toBe("");
        expect(t.segments[1]).toBe("% 的几率在击中敌人后获得怒火 +");
        expect(t.segments[t.segments.length - 1]).toBe("");
    });

    test(`t's param index numbers are right`, () => {
        expect(t.paramIndexNumbers[0]).toBe(1);
        expect(t.paramIndexNumbers[1]).toBe(0);
    });
}

function testRenderTemplate() {
    const zhTemplate = new Template("{1}% 的几率在击中敌人后获得怒火 +{0}");
    const enTemplate = new Template(
        "grant +{0} Rage with {1}% chance if it Hits Enemies"
    );
    const zhMod = "90% 的几率在击中敌人后获得怒火 +5";
    const enMod = "grant +5 Rage with 90% chance if it Hits Enemies";

    const result = enTemplate.render(zhTemplate.parseParams(zhMod));
    test(`render sucess`, () => {
        expect(result).toBe(enMod);
    });
}

testCreateTemplate();
testRenderTemplate();
