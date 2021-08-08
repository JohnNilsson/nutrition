import { observer } from "mobx-react-lite";
import { fromPromise } from "mobx-utils";
import { NutritionStats } from "./NutritionStats";

import dbPromise from "../../../../services/FoodData";

const dbPromiseObservable = fromPromise(dbPromise);

const NutritionStatsLoader = observer(
  function NutritionStatsLoader() {
    return dbPromiseObservable.case({
      fulfilled: db => <NutritionStats db={db} />,
      pending: () => <div>Loading...</div>,
      rejected: err => <div>{err.message}</div>
    });
  }
);

export default NutritionStatsLoader;
