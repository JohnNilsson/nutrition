import ReactDOM from "react-dom";
import App from "./App";
import { AppState } from "./state";

it("renders without crashing", () => {
  const div = document.createElement("div");
  const state = new AppState();
  ReactDOM.render(<App state={state} />, div);
});
