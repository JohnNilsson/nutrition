import "./services/FoodData"; // Start loading the data in the background

import { autorun, configure, toJS } from "mobx";

import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { AppState } from "./state";
import * as stateJson from "./state/json"

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

ReactDOM.render(<App state={state} />, document.getElementById("root"));
registerServiceWorker();
