import React, { FunctionComponent, useState } from "react";

import "semantic-ui-css/semantic.min.css";
import { FlexDirectionProperty } from "csstype";

import Home from "./pages/Home";
import NutritionTable from "./pages/Data";

import { AppState } from "./state/";
import { Menu } from "semantic-ui-react";

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
    render: () => <Home />
  },
  foods: {
    icon: "food",
    name: "Mat",
    render: () => <div>Foods</div>
  },
  data: {
    icon: "database",
    name: "Data",
    render: () => <NutritionTable />
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
        </Menu>
        <FlexCol>
          <FlexColItem>{pages[page].render()}</FlexColItem>
        </FlexCol>
      </React.StrictMode>
    </div>
  );
};

export default App;
