import * as React from "react";

import TopMenu from "./components/TopMenu";
// import NutritionStats from "./components/NurtitionStats";
// import SelectedFoods from "./components/SelectedFoods";
const NutritionTable = React.lazy(() => import("./components/NutritionTable"));

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

const FlexCol: React.FunctionComponent = ({ children }) => (
  <div style={floxColStyles}>{children}</div>
);

const flexColItemStyle = {
  flex: "1"
};

const FlexColItem: React.FunctionComponent = ({ children }) => (
  <div style={flexColItemStyle}>{children}</div>
);

const App = () => (
  <div className="App" style={appStyle}>
    <React.StrictMode>
      <TopMenu />
      <FlexCol>
        <FlexColItem>
          <React.Suspense fallback={<div>Loading...</div>}>
            <NutritionTable />
          </React.Suspense>
        </FlexColItem>
      </FlexCol>
    </React.StrictMode>
  </div>
);

export default App;
