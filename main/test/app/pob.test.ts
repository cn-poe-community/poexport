import { expect, test } from "@jest/globals";
import { Pob } from "../../src/app/pob";

function testGetRoot() {
    const testcases = [
        "D:/AppsInDisk/PoeCharm_v20220713",
        "D:/AppsInDisk/PoeCharm_v20220713/PathOfBuilding-Community",
        "D:/",
    ];

    const results = [
        "D:/AppsInDisk/PoeCharm_v20220713/PathOfBuilding-Community",
        "D:/AppsInDisk/PoeCharm_v20220713/PathOfBuilding-Community",
        "",
    ];

    for (let i = 0; i < testcases.length; i++) {
        const testcase = testcases[i];
        const expected = results[i];

        test(`the root path of ${testcase} should be ${expected}`, async () => {
            const result = (await Pob.getRoot(testcase)).replace(/\\/g, "/");
            expect(result).toBe(expected);
        });
    }
}

testGetRoot();
