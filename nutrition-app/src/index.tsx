import "./services/FoodData"; // Start loading the data in the background

import React from "react";
import { createRoot } from 'react-dom/client';

import { autorun, configure } from "mobx";

import App from "./ui/App";
import { AppState } from "./ui/store";
import * as stateJson from "./state/json";
import { AppStateContext } from "./ui/store";

configure({
  enforceActions: "always",
  computedRequiresReaction: true,
  reactionRequiresObservable: true,
  observableRequiresReaction: true,
  //disableErrorBoundaries: true // if not prod build?
});

function loadSnapshot(appState: AppState) {
  const snapshotString = localStorage.getItem("state");
  if (snapshotString !== null) {
    const snapshot = JSON.parse(snapshotString) as unknown;
    const parsed = stateJson.parse(snapshot);
    appState.loadJSON(parsed);
  }
}

const state = new AppState();
loadSnapshot(state);

autorun(() => {
  localStorage.setItem("state", JSON.stringify(state));
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AppStateContext.Provider value={state}>
      <App />
    </AppStateContext.Provider>
  </React.StrictMode>
);
