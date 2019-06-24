import { types } from "mobx-state-tree";

import { Navigation } from "./Navigation";

export const RootStore = types.model({
  nav: Navigation
});
