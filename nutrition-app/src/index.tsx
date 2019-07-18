import "./services/FoodData"; // Start loading the data in the background

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { createAppState, AppState } from "./state";
import { onSnapshot, applySnapshot } from "mobx-state-tree";

const saveSnapshot = (snapshot: any) => {
  localStorage.setItem("state", JSON.stringify(snapshot));
};

const loadSnapshot = (state: any) => {
  const snapshotString = localStorage.getItem("state");
  if (snapshotString !== null) {
    const snapshot = JSON.parse(snapshotString);
    if (AppState.is(snapshot)) {
      applySnapshot(state, snapshot);
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
