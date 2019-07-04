import React from "react";
import { Grid } from "semantic-ui-react";

import SelectedFoods from "./SelectedFoods";
import NutritionStats from "./NurtitionStats";

export interface HomeProps {}

const Home = (props: HomeProps) => (
  <Grid columns="equal">
    <Grid.Column width={3}>
      <SelectedFoods />
    </Grid.Column>
    <Grid.Column>
      <NutritionStats />
    </Grid.Column>
  </Grid>
);

export default Home;
