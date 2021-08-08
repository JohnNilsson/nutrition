import ReactDOM from "react-dom";
import App from "./App";
import { AppState } from "../state/AppState";
import React from "react";
import { AppStateContext } from "./store";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const state = new AppState();
  ReactDOM.render(
    <React.StrictMode>
      <AppStateContext.Provider value={state}>
        <App />
      </AppStateContext.Provider>
    </React.StrictMode>,
    div
  );
});
