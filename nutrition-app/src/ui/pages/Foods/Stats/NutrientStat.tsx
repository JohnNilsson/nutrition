import { round } from "lodash-es";
import { observer } from "mobx-react-lite";
import { Card, Statistic } from "semantic-ui-react";
import { Db, getNutritientValue, Nutrient } from "../../../../services/FoodData";
import { useAppState } from "../../../store";

interface NutrientStatProps {
    nutrient: Nutrient;
    db: Db;
  }
  export const NutrientStat = observer<NutrientStatProps>(function NutrientStat({
    nutrient,
    db
  }) {
    const state = useAppState();
    let value = 0;
    for (const food of state.foods.values()) {
      const nutrientValue = getNutritientValue(db, nutrient.id, Number(food.id));
      value += (/*food.ammount*/100 / 100) * nutrientValue;
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