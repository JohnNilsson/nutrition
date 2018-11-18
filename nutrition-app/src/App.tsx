import * as React from "react";

import TopMenu from "./components/TopMenu";
import NutritionStats from "./components/NurtitionStats";
import SelectedFoods from "./components/SelectedFoods";

import "semantic-ui-css/semantic.min.css";
import { FlexDirectionProperty } from "csstype";

const appStyle = {
  height: "100vh"
};

const floxColStyles = {
  height: "100%",
  display: "flex",
  flexDirection: "column" as FlexDirectionProperty
};

const FlexCol: React.FunctionComponent
= ({ children }) => <div style={floxColStyles}>{children}</div>;

const flexColItemStyle = {
  flex: "1"
};

const FlexColItem: React.FunctionComponent
= ({ children }) => (
  <div style={flexColItemStyle}>{children}</div>
);

const App = () => (
  <div className="App" style={appStyle}>
    <React.StrictMode>
      <TopMenu />
      <FlexCol>
        <FlexColItem>
          <SelectedFoods />
        </FlexColItem>
        <FlexColItem>
          <NutritionStats />
        </FlexColItem>
      </FlexCol>
    </React.StrictMode>
  </div>
);

export default App;
