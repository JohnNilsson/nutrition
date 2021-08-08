import { Db, getNutritientTypes } from "../../../../services/FoodData";
import { Card, Container } from "semantic-ui-react";
import { NutrientStat } from "./NutrientStat";

export interface NutritionStatProps {
  db: Db;
}
  
export function NutritionStats({ db }: NutritionStatProps) {
  return (
    <Container fluid textAlign="center">
      <Card.Group>
        {getNutritientTypes(db).map(n => (
          <NutrientStat key={n.id} nutrient={n} db={db} />
        ))}
      </Card.Group>
    </Container>
  );
}
