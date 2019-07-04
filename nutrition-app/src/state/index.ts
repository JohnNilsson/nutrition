import { types } from "mobx-state-tree";

export const AppState = types.model({});

export type AppState = typeof AppState.Type;

export const createAppState = () => {
  return AppState.create({});
};
