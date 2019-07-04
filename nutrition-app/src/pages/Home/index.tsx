import React, { FunctionComponent } from "react";
import { Grid } from "semantic-ui-react";

import SelectedFoods from "./SelectedFoods";
import NutritionStats from "./NurtitionStats";
import { AppState } from "../../state";

export interface HomeProps {}

const Home: FunctionComponent<{ state: AppState }> = ({ state }) => (
  <Grid columns="equal">
    <Grid.Column width={5}>
      <SelectedFoods state={state} />
    </Grid.Column>
    <Grid.Column>
      <NutritionStats />
    </Grid.Column>
  </Grid>
);

export default Home;
