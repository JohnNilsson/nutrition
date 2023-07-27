import test from "node:test";
import { strict as assert } from "node:assert";
import { setNulls } from "./utils.js";

import data, { NäringsvärdeJson } from "../data/Naringsvarde.6NF.json" assert { type: "json" };
var data6NF = data as unknown as NäringsvärdeJson; // Have no idea why typescript doesn't recognize the type

const getKeys = Object.keys as <T extends object>(obj: T) => Array<keyof T>;

for (const key of getKeys(data6NF.Livsmedel.Naringsvarde)) {
  setNulls(data6NF.Livsmedel.Naringsvarde[key].Varde, NaN);
}

test("Group is array", () => {
  assert.ok(Array.isArray(data6NF.Grupp));
});

test("6NF data has no missing values", () => {
  assert.ok(typeof data6NF === "object");
  assert.ok(typeof data6NF.Livsmedel === "object");
  testForeignKeys(data6NF.Livsmedel, '["Livsmedel"]');
});

function testForeignKeys(object: { [key: string]: unknown }, path: string) {
  for (const key of Object.keys(object)) {
    const arr = object[key];
    if (key === "Varde") {
      continue;
    }
    if (Array.isArray(arr)) {
      const ix = arr.findIndex((v) => v === null || v === undefined);
      assert.deepStrictEqual(
        ix,
        -1,
        path +
          '["' +
          key +
          '"] should have no missing values.' +
          (ix == -1 ? "" : " [" + ix + "] was: " + arr[ix])
      );
    } else if (typeof arr === "object") {
      testForeignKeys(
        arr as { [key: string]: unknown },
        path + '["' + key + '"]'
      );
    }
  }
}
