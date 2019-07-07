import React, { FunctionComponent, useState } from "react";
import { observer, useObserver } from "mobx-react-lite";
import { fromPromise } from "mobx-utils";

import { AppState } from "../../state";
import dbPromise, {
  Db,
  getNutritientValue,
  getNutritientTypes,
  Nutrient
} from "../../services/FoodData";
import { Statistic, Card, Container } from "semantic-ui-react";
import { trace } from "mobx";
import { round } from "lodash-es";

const NutrientStat: FunctionComponent<{
  nutrient: Nutrient;
  state: AppState;
  db: Db;
}> = observer(({ nutrient, state, db }) => {
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

const NutritionStats: FunctionComponent<{
  state: AppState;
  db: Db;
}> = ({ state, db }) => (
  <Container fluid textAlign="center">
    <Card.Group>
      {getNutritientTypes(db).map(n => (
        <NutrientStat key={n.id} nutrient={n} state={state} db={db} />
      ))}
    </Card.Group>
  </Container>
);

//const dbPromiseObservable = fromPromise(dbPromise);

const NutritionStatsLoader: FunctionComponent<{ state: AppState }> = ({
  state
}) => {
  const [dbPromiseObservable] = useState(() => fromPromise(dbPromise));
  return useObserver(() => {
    const element = dbPromiseObservable.case({
      fulfilled: db => <NutritionStats db={db} state={state} />,
      pending: () => <div>Loading...</div>,
      rejected: err => <div>{err.message}</div>
    });
    trace();
    console.log(
      "NutritionStatsLoader",
      dbPromiseObservable.state,
      element.type
    );
    return element;
  });
};

export default NutritionStatsLoader;
