import NutritionStatsLoader from "./Stats/NutritionStatsLoader";

import { Grid, Segment, Table } from "semantic-ui-react";

import dbPromise, { FoodData, type Nutrient } from "../../../services/FoodData";
import { fromPromise } from "mobx-utils";
import { observer } from "mobx-react-lite";

function toNutrientTable(db: FoodData): NutVal[] {
  const types = new Map<string, Nutrient>();
  for (const n of db.getNutritientTypes()) {
    types.set(n.abbr, n);
  }
  // TODO: ...
  return [
    { name: "Energi", per100g: "200 kJ/45 kcal" },
    {
      name: "Fett",
      per100g: "1,5 g",
      children: [{ name: "varav mättat fett", per100g: "1,0g" }],
    },
    {
      name: "Kolhydrat",
      per100g: "4,9 g",
      children: [{ name: "varav sockerarter", per100g: "1,0g" }],
    },
    { name: "Protein", per100g: "3,5 g" },
    { name: "Salt", per100g: "0,1 g" },
  ];
}

const dbPromiseObservable = fromPromise(dbPromise);

interface NutVal {
  name: string;
  per100g: string;
  children?: NutVal[];
}

export default observer(function FoodsPage() {
  const nutrients = dbPromiseObservable.case({
    fulfilled: toNutrientTable,
    pending: () => [],
    rejected: (err) => {
      console.error(err);
      return [];
    },
  });
  return (
    <Grid columns={2} relaxed="very">
      <Grid.Column>
        <p>Test</p>
      </Grid.Column>
      <Grid.Column>
        <h2>Näringsvärde</h2>
        <Table basic="very" compact>
          <Table.Body>
            <Table.Row>
              <Table.Cell></Table.Cell>
              <Table.Cell>Per 100 g</Table.Cell>
            </Table.Row>
            {nutrients.map((n) => (
              <>
                <Table.Row>
                  <Table.Cell>{n.name}:</Table.Cell>
                  <Table.Cell>{n.per100g}</Table.Cell>
                </Table.Row>
                {n.children?.map((n) => (
                  <Table.Row>
                    <Table.Cell style={{ paddingLeft: "1em" }}>
                      {n.name}:
                    </Table.Cell>
                    <Table.Cell>{n.per100g}</Table.Cell>
                  </Table.Row>
                ))}
              </>
            ))}
          </Table.Body>
        </Table>
        <Segment>
          <NutritionStatsLoader />
        </Segment>
      </Grid.Column>
    </Grid>
  );
});
