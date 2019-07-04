import React, { FunctionComponent, useState } from "react";

import "semantic-ui-css/semantic.min.css";
import { FlexDirectionProperty } from "csstype";

import Home from "./pages/Home";
import NutritionTable from "./pages/Data";

import { AppState } from "./state/";
import { Menu } from "semantic-ui-react";
import AddFoodSearch from "./pages/Home/SelectedFoods/AddFoodSearch";

const appStyle = {
  height: "100vh"
};

const floxColStyles = {
  height: "100%",
  display: "flex",
  flexDirection: "column" as FlexDirectionProperty
};

const FlexCol: FunctionComponent = ({ children }) => (
  <div style={floxColStyles}>{children}</div>
);

const flexColItemStyle = {
  flex: "1"
};

const FlexColItem: FunctionComponent = ({ children }) => (
  <div style={flexColItemStyle}>{children}</div>
);

const pages = {
  home: {
    icon: "home",
    name: "Hem",
    render: (state: AppState) => <Home state={state} />
  },
  foods: {
    icon: "food",
    name: "Mat",
    render: (state: AppState) => <div>Foods</div>
  },
  data: {
    icon: "database",
    name: "Data",
    render: (state: AppState) => <NutritionTable />
  }
};

type Page = keyof typeof pages;

const App: FunctionComponent<{ state: AppState }> = ({ state }) => {
  const [page, go] = useState<Page>("home");
  return (
    <div className="App" style={appStyle}>
      <React.StrictMode>
        <Menu>
          {Object.entries(pages).map(([key, def]) => (
            <Menu.Item
              key={key}
              icon={def.icon}
              name={def.name}
              active={page === key}
              onClick={() => go(key as Page)}
            />
          ))}
          <Menu.Menu position="right">
            <Menu.Item>
              <AddFoodSearch state={state} />
            </Menu.Item>
          </Menu.Menu>
        </Menu>
        <FlexCol>
          <FlexColItem>{pages[page].render(state)}</FlexColItem>
        </FlexCol>
      </React.StrictMode>
    </div>
  );
};

export default App;
