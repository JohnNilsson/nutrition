import React, { FunctionComponent } from "react";
import { List } from "semantic-ui-react";
import { AppState, Food } from "../../../state";
import { observer } from "mobx-react-lite";

const FoodItem: FunctionComponent<{ food: Food }> = observer(({ food }) => (
  <List.Item>
    <List.Header>{food.name}</List.Header>
    {food.ammount} g
  </List.Item>
));

const byName = (f1: Food, f2: Food) => f1.name.localeCompare(f2.name);

const SelectedFoodsList: FunctionComponent<{ state: AppState }> = observer(
  ({ state }) => {
    const foods = Array.from(state.foods.values());
    foods.sort(byName);
    return (
      <List>
        {foods.map(food => (
          <FoodItem food={food} />
        ))}
      </List>
    );
  }
);

export default SelectedFoodsList;
