import React from "react";
import { observer } from "mobx-react-lite";
import { fromPromise } from "mobx-utils";

import { AppState } from "../../state";
import dbPromise, {
  Db,
  getNutritientValue,
  getNutritientTypes,
  Nutrient
} from "../../services/FoodData";
import { Statistic, Card, Container } from "semantic-ui-react";
import { round } from "lodash-es";

interface NutrientStatProps {
  nutrient: Nutrient;
  state: AppState;
  db: Db;
}
const NutrientStat = observer<NutrientStatProps>(function NutrientStat({
  nutrient,
  state,
  db
}) {
  let value = 0;
  for (const food of state.foods.values()) {
    const nutrientValue = getNutritientValue(db, nutrient.id, food.id);
    value += (food.ammount / 100) * nutrientValue;
  }
  value = round(value, 2);

  return (
    <Card>
      <Card.Header>{nutrient.name}</Card.Header>
      <Card.Meta>{nutrient.abbr}</Card.Meta>
      <Card.Content>
        <Statistic size="large" value={value} />
        {nutrient.unit}
      </Card.Content>
    </Card>
  );
});

interface NutritionStatProps {
  state: AppState;
  db: Db;
}
function NutritionStats({ state, db }: NutritionStatProps) {
  return (
    <Container fluid textAlign="center">
      <Card.Group>
        {getNutritientTypes(db).map(n => (
          <NutrientStat key={n.id} nutrient={n} state={state} db={db} />
        ))}
      </Card.Group>
    </Container>
  );
}

const dbPromiseObservable = fromPromise(dbPromise);

interface NutritionStatsLoaderProps {
  state: AppState;
}
const NutritionStatsLoader = observer<NutritionStatsLoaderProps>(
  function NutritionStatsLoader({ state }) {
    return dbPromiseObservable.case({
      fulfilled: db => <NutritionStats db={db} state={state} />,
      pending: () => <div>Loading...</div>,
      rejected: err => <div>{err.message}</div>
    });
  }
);

export default NutritionStatsLoader;
