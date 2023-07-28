import type { NäringsvärdeJson } from "sfcd/data.json";

export interface Db extends NäringsvärdeJson {}

export default import(
  /* webpackPrefetch: true */
  "sfcd/data.json"
).then((m) => {
  const db = m.default;
  Object.assign(window, { db });
  return new FoodData(db);
});

export class FoodData {
  constructor(public db: Db) {}
  getNutritientTypes() {
    return getNutritientTypes(this.db);
  }
  getNutritientValue(nutrientId: number, foodId: number) {
    return getNutritientValue(this.db, nutrientId, foodId);
  }
  getNutritientValues(foodId: number) {
    return getNutritientValues(this.db, foodId);
  }
  getFoodNames() {
    return this.db.Livsmedel.Namn;
  }
}

export interface Nutrient {
  id: number;
  name: string;
  abbr: string;
  unit: string;
}

export const getNutritientTypes = ({ Naringsamne }: Db) => {
  const { Forkortning, Enhet, Namn } = Naringsamne;
  const nutrients: Nutrient[] = Forkortning.map((key, i) => ({
    id: i,
    name: Namn[i]!,
    abbr: key,
    unit: Enhet[i]!,
  }));
  return nutrients;
};

export const getNutritientValue = (
  db: Db,
  nutrientId: number,
  foodId: number
): number =>
  db.Livsmedel.Naringsvarde[db.Naringsamne.Forkortning[nutrientId]!]!.Varde[
    foodId
  ]!;

export const getNutritientValues = (db: Db, foodId: number) => {
  const Nutrient = db.Livsmedel.Naringsvarde;
  return db.Naringsamne.Forkortning.map((key) => Nutrient[key]!.Varde[foodId]);
};
