import { StrictMode, useState } from "react";
import { Menu } from "semantic-ui-react";

import "semantic-ui-css/semantic.min.css";

import AddFoodSearch from "./components/AddFoodSearch";
import SelectedFoods from "./components/SelectedFoods";
import FamilyMenuItem from "./components/FamilyMenuItem";
import FamilyMemberPopup from "./components/FamilyMemberPopup";
import NutritionStats from "./pages/Stats";
import { AppState } from "./state";

const pages = {
  stats: {
    icon: "home",
    name: "Hem",
    render: (state: AppState) => <NutritionStats state={state} />
  },
  // foods: {
  //   icon: "food",
  //   name: "Mat",
  //   render: (state: AppState) => <div>Foods</div>
  // },
};

type Page = keyof typeof pages;

interface AppProps {
  state: AppState;
}
const App: React.FC<AppProps> = function App({ state }) {
  const [page, go] = useState<Page>("stats");

  return (
    <StrictMode>
      <div
        className="App"
        style={{
          height: "100vh",
          display: "flex"
        }}
      >
        <div style={{ flex: "0 0 auto", height: "100%", overflow: "overflow" }}>
          <Menu style={{ height: "100%" }} vertical borderless fluid>
            {Object.entries(pages).map(([key, def]) => (
              <Menu.Item
                key={key}
                icon={def.icon}
                name={def.name}
                active={page === key}
                onClick={() => go(key as Page)}
              />
            ))}
            <FamilyMenuItem state={state} />
            <Menu.Item fitted>
              <AddFoodSearch state={state} size="small" />
            </Menu.Item>
            <Menu.Item>
              <SelectedFoods state={state} />
            </Menu.Item>
          </Menu>
        </div>
        <div
          style={{
            flex: "1 1 auto",
            padding: "1em",
            overflowY: "scroll",
            height: "100%"
          }}
        >
          {pages[page].render(state)}
        </div>
      </div>
      <FamilyMemberPopup state={state} />
    </StrictMode>
  );
}

export default App;
