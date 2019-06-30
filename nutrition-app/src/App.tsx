import * as React from "react";
import { observer } from "mobx-react-lite";

import "semantic-ui-css/semantic.min.css";
import { FlexDirectionProperty } from "csstype";

import { StoreProvider, useStore } from "./store";

import TopMenu from "./components/TopMenu";
import Home from "./components/Home";
import NutritionTable from "./components/NutritionTable";

import { Page } from "./state/Navigation";

const appStyle = {
  height: "100vh"
};

const floxColStyles = {
  height: "100%",
  display: "flex",
  flexDirection: "column" as FlexDirectionProperty
};

const FlexCol: React.FunctionComponent = ({ children }) => (
  <div style={floxColStyles}>{children}</div>
);

const flexColItemStyle = {
  flex: "1"
};

const FlexColItem: React.FunctionComponent = ({ children }) => (
  <div style={flexColItemStyle}>{children}</div>
);

const CurrentPage = observer(() => {
  var store = useStore();
  switch (store.nav.page) {
    case Page.Data:
      return <NutritionTable />;
    case Page.Foods:
      return <div>Foods</div>;
    case Page.Home:
    default:
      return <Home />;
  }
});

const App = () => (
  <div className="App" style={appStyle}>
    <React.StrictMode>
      <StoreProvider>
        <TopMenu />
        <FlexCol>
          <FlexColItem>
            <CurrentPage />
          </FlexColItem>
        </FlexCol>
      </StoreProvider>
    </React.StrictMode>
  </div>
);

export default App;
