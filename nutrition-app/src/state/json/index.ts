import type * as v1 from "./v1";
import type * as v2 from "./v2";
export * from "./v2";

function upgrade(state: v1.AppStateJson): v2.AppStateJson {
  const family = {} as v2.FamilyJson;
  for (const [k, v] of Object.entries(state.family?.members ?? {})) {
    family[k] = v;
  }

  const foods = {} as v2.FoodsJson;
  for (const [k, v] of Object.entries(state.foods?.selectedFoods ?? {})) {
    foods[k] = { name: v.name! };
  }

  return {
    version: 2,
    foods,
    family,
  };
}

export function parse(json: unknown): v2.AppStateJson {
  if (!isJSONObject(json)) {
    throw new Error("Invalid json");
  }
  if (json['version'] === 2) {
    return json as v2.AppStateJson;
  }
  return upgrade(json as v1.AppStateJson);
}

type JSONObject = { [prop: string]: JSONValue };

type JSONArray = JSONValue[];

type JSONValue = undefined | null | string | number | JSONArray | JSONObject;

function isJSONObject(json: unknown): json is JSONObject {
  if (json === null || json === undefined) {
    return false;
  }

  if (typeof json !== "object" || Array.isArray(json)) {
    return false;
  }

  return true;
}
