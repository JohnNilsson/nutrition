import React, { FunctionComponent } from "react";
import AddFoodSearch from "./AddFoodSearch";
import SelectedFoodsList from "./SelectedFoodsList";
import { AppState } from "../../../state";

const SelectedFoods: FunctionComponent<{ state: AppState }> = ({ state }) => (
  <>
    <AddFoodSearch state={state} />
    <SelectedFoodsList state={state} />
  </>
);

export default SelectedFoods;
