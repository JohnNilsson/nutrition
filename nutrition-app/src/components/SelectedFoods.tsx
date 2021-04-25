import { List, Icon } from "semantic-ui-react";
import { AppState } from "../state";
import { Food } from "../state/Foods";
import { observer } from "mobx-react-lite";

interface FoodItemProps {
  food: Food;
  onDelete: () => void;
}
const FoodItem = function FoodItem({ food, onDelete }: FoodItemProps) {
  return (
    <List.Item>
      <List.Header>
        <Icon link name="delete" onClick={onDelete} />
        {food.name}
      </List.Header>
      {/*food.ammount*/100} g
    </List.Item>
  );
};

const byName = (f1: Food, f2: Food) => (f1.name ?? "").localeCompare(f2.name ?? "");

interface SelectedFoodsListProps {
  state: AppState;
}
const SelectedFoodsList = observer<SelectedFoodsListProps>(
  function SelectedFoodsList({ state }) {
    const foods = Array.from(state.foods.values());
    foods.sort(byName);
    return (
      <List>
        {foods.map(food => (
          <FoodItem
            key={food.id}
            food={food}
            onDelete={() => state.foods.delete(food.id)}
          />
        ))}
      </List>
    );
  }
);

export default SelectedFoodsList;
