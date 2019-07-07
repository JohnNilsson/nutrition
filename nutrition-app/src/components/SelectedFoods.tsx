import React, { FunctionComponent } from "react";
import { List, Icon } from "semantic-ui-react";
import { AppState, Food } from "../state";
import { observer } from "mobx-react-lite";

const FoodItem: FunctionComponent<{
  food: Food;
  onDelete: () => void;
}> = observer(({ food, onDelete }) => (
  <List.Item>
    <List.Header>
      <Icon link name="delete" onClick={onDelete} />
      {food.name}
    </List.Header>
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
          <FoodItem
            key={food.id}
            food={food}
            onDelete={() => state.removeFood(food.id)}
          />
        ))}
      </List>
    );
  }
);

export default SelectedFoodsList;
