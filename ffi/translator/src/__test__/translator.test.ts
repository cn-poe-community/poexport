import translator from "../translator.js";

import items from "./items.json";
import passiveSkills from "./passiveskills.json";

import { writeFileSync } from "node:fs";

test("json translation", () => {
    translator.translateItems(items);
    translator.translatePassiveSkills(passiveSkills);
    writeFileSync("src/__test__/items_translated.json", JSON.stringify(items));
    writeFileSync("src/__test__/passiveskills_translated.json", JSON.stringify(passiveSkills));
});

