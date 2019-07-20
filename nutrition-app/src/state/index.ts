import { types, Instance } from "mobx-state-tree";
import { Family } from "./Family";
import { View } from "./View";
import { Foods } from "./Foods";

export const AppState = types.model({
  view: types.optional(View, { selectedFamilyMember: undefined }),
  foods: types.optional(Foods, { selectedFoods: {} }),
  family: types.optional(Family, { members: {} })
});

export interface AppState extends Instance<typeof AppState> {}

export const createAppState = () => {
  return AppState.create();
};
