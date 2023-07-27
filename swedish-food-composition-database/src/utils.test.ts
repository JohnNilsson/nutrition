import test from "node:test";
import { strict as assert } from "node:assert";

import { setNulls, id, sortByFkFrequency } from "./utils.js";

test("id gets index of existing value", () => {
  const val1 = "test value 1";
  const val2 = "test value 2";
  const val3 = "test value 3";
  const arr = [val1, val2, val3];

  const ix = id(val2, arr);

  assert.deepStrictEqual(ix, 1);
});

test("id add, and gets gets index of missing value", () => {
  const val1 = "test value 1";
  const val2 = "test value 2";
  const val3 = "test value 3";
  const arr = [val1, val2, val3];

  const val4 = "test value 4";

  const ix = id(val4, arr);

  assert.deepStrictEqual(ix, 3);
  assert.deepStrictEqual(arr, [val1, val2, val3, val4]);
});

test("id gets index of null", () => {
  const val1 = "test value 1";
  const val2 = "test value 2";

  const arr = [val1, null, val2];

  const ix = id(null, arr);

  assert.deepStrictEqual(ix, 1);
  assert.deepStrictEqual(arr, [val1, null, val2]);
});

test("id gets index of null for undefined", () => {
  const val1 = "test value 1";
  const val2 = "test value 2";

  const arr = [val1, val2];

  const ix = id(undefined, arr);

  assert.deepStrictEqual(ix, 2);
  assert.deepStrictEqual(arr, [val1, val2, null]);
});

test("sortByFkFrequency", () => {
  const dataArr = ["A", "B", "C"];
  const fkArr = [2, 2, 1, 1, 1, 0];

  sortByFkFrequency(fkArr, dataArr);

  assert.deepStrictEqual(dataArr, ["B", "C", "A"]);
  assert.deepStrictEqual(fkArr, [1, 1, 0, 0, 0, 2]);
});

test("set nulls", () => {
  const arr = [null, undefined, "", 0, "text", 1, NaN, null];
  const n = "NULL";
  setNulls(arr, n);

  assert.deepStrictEqual(
    arr.map((v) => (Number.isNaN(v) ? "NaN" : v)),
    [n, n, "", 0, "text", 1, "NaN", n]
  );
});

test("set nulls to NaN", () => {
  const arr = [null, 1, NaN];
  setNulls(arr, NaN);

  assert.ok(Number.isNaN(arr[0]));
  assert.ok(1 === arr[1]);
  assert.ok(Number.isNaN(arr[2]));
});
