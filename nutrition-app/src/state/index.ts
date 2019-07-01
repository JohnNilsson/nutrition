import { types } from "mobx-state-tree";

import { Navigation } from "./Navigation";
import { Foods } from "./Foods";

export const AppState = types.model({
  nav: Navigation,
  foods: Foods
});

export type AppState = typeof AppState.Type;

export const createAppState = () => {
  const nav = Navigation.create();
  const foods = Foods.create();
  return AppState.create({ nav, foods });
};
