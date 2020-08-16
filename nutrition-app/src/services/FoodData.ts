import { Naringsvarde } from "./sfcd";

export interface Db extends Naringsvarde {}

export default import(
  /* webpackPrefetch: true */
  "./sfcd/Naringsvarde.6NF.json"
).then(m => {
  const db = m.default;
  Object.assign(window, { db });
  return db as Db;
});

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
    name: Namn[i],
    abbr: key,
    unit: Enhet[i]
  }));
  return nutrients;
};

export const getNutritientValue = (
  db: Db,
  nutrientId: number,
  foodId: number
) =>
  db.Livsmedel.Naringsvarde[db.Naringsamne.Forkortning[nutrientId]].Varde[
    foodId
  ];

export const getNutritientValues = (db: Db, foodId: number) => {
  const Nutrient = db.Livsmedel.Naringsvarde;
  return db.Naringsamne.Forkortning.map(key => Nutrient[key].Varde[foodId]);
};
