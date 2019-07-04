import "./services/FoodData"; // Start loading the data in the background

import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import registerServiceWorker from "./registerServiceWorker";

import { createAppState } from "./state";

const state = createAppState();

ReactDOM.render(<App state={state} />, document.getElementById("root"));
registerServiceWorker();
