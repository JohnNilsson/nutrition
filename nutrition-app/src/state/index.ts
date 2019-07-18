import { types, Instance } from "mobx-state-tree";
import { Family } from "./Family";
import { View } from "./View";

export const NutritionalContent = types.model("NutritionalContent", {});

export const Food = types.model("Food", {
  id: types.identifierNumber, // Just a number for now, might be some globally valid uri thing in the future
  name: types.string,
  nutrients: NutritionalContent,
  ammount: types.number
});

export interface Food extends Instance<typeof Food> {}

export const AppState = types
  .model({
    view: types.optional(View, { selectedFamilyMember: undefined }),
    foods: types.map(Food),
    family: types.optional(Family, { members: {} })
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
      },
      removeFood(id: number) {
        self.foods.delete(id as any);
      },
      afterCreate() {
        self.family = Family.create();
      }
    };
  });

export interface AppState extends Instance<typeof AppState> {}

export const createAppState = () => {
  return AppState.create();
};
