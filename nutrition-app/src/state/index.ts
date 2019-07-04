import { types } from "mobx-state-tree";

export const NutritionalContent = types.model("NutritionalContent", {});

export const Food = types.model("Food", {
  id: types.identifierNumber, // Just a number for now, might be some globally valid uri thing in the future
  name: types.string,
  nutrients: NutritionalContent,
  ammount: types.number
});

export type Food = typeof Food.Type;

export const AppState = types
  .model({
    foods: types.map(Food)
  })
  .actions(self => {
    return {
      addFood(id: number, name: string) {
        const food = Food.create({
          id,
          name,
          nutrients: NutritionalContent.create(),
          ammount: 100
        });
        self.foods.put(food);
      }
    };
  });

export type AppState = typeof AppState.Type;

export const createAppState = () => {
  return AppState.create();
};
