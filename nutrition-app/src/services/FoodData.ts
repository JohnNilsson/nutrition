import { Naringsvarde } from "swedish-food-composition-database";
export interface Db extends Naringsvarde {}

export default import(
  /* webpackPrefetch: true */
  "swedish-food-composition-database/data/Naringsvarde.6NF.json"
).then(m => m.default as Db);
