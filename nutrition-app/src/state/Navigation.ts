import { types } from "mobx-state-tree";

export enum Page {
  Home,
  Foods,
  Data
}

export const Navigation = types
  .model("Navigation", {
    page: Page.Home
  })
  .actions(self => ({
    go(page: Page) {
      self.page = page;
    }
  }));
