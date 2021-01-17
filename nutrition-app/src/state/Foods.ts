import { types, Instance } from "mobx-state-tree";

export const NutritionalContent = types.model("NutritionalContent", {});

export const Food = types.model("Food", {
  id: types.identifierNumber, // Just a number for now, might be some globally valid uri thing in the future
  name: types.string,
  nutrients: NutritionalContent,
  ammount: types.number
});

export interface IFood extends Instance<typeof Food> {}

export const Foods = types
  .model("Foods", {
    selectedFoods: types.map(Food)
  })
  .actions(self => ({
    add(id: number, name: string) {
      const food = Food.create({
        id,
        name,
        nutrients: NutritionalContent.create(),
        ammount: 100
      });
      self.selectedFoods.put(food);
    },
    remove(id: number) {
      self.selectedFoods.delete(id as any);
    }
  }));
