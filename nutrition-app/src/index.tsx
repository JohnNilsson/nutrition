import "./services/FoodData"; // Start loading the data in the background

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { createAppState, AppState } from "./state";
import { onSnapshot, applySnapshot } from "mobx-state-tree";

const FOODS = "foods";
const saveSnapshot = (snapshot: any) => {
  localStorage.setItem(FOODS, JSON.stringify(snapshot.foods));
};

const loadSnapshot = (state: any) => {
  const snapshotString = localStorage.getItem(FOODS);
  if (snapshotString !== null) {
    const snapshot = JSON.parse(snapshotString);
    if (AppState.is(snapshot)) {
      applySnapshot(state.foods, snapshot);
    } else {
      console.error("Invalid snapshot found", snapshot);
    }
  }
};

const state = createAppState();
loadSnapshot(state);
onSnapshot(state, saveSnapshot);

ReactDOM.render(<App state={state} />, document.getElementById("root"));
registerServiceWorker();
