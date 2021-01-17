import { List, Icon } from "semantic-ui-react";
import { IAppState } from "../state";
import { IFood } from "../state/Foods";
import { observer } from "mobx-react-lite";

interface FoodItemProps {
  food: IFood;
  onDelete: () => void;
}
const FoodItem = observer(function FoodItem({ food, onDelete }: FoodItemProps) {
  return (
    <List.Item>
      <List.Header>
        <Icon link name="delete" onClick={onDelete} />
        {food.name}
      </List.Header>
      {food.ammount} g
    </List.Item>
  );
});

const byName = (f1: IFood, f2: IFood) => f1.name.localeCompare(f2.name);

interface SelectedFoodsListProps {
  state: IAppState;
}
const SelectedFoodsList = observer<SelectedFoodsListProps>(
  function SelectedFoodsList({ state }) {
    const foods = Array.from(state.foods.selectedFoods.values());
    foods.sort(byName);
    return (
      <List>
        {foods.map(food => (
          <FoodItem
            key={food.id}
            food={food}
            onDelete={() => state.foods.remove(food.id)}
          />
        ))}
      </List>
    );
  }
);

export default SelectedFoodsList;
