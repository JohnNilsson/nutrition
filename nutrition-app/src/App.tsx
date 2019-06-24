import * as React from "react";
import { observer } from "mobx-react";

import { RootStore } from "./state";

import TopMenu from "./components/TopMenu";
// import NutritionStats from "./components/NurtitionStats";
// import SelectedFoods from "./components/SelectedFoods";

import "semantic-ui-css/semantic.min.css";
import { FlexDirectionProperty } from "csstype";
import { Page, Navigation } from "./state/Navigation";

const NutritionTable = React.lazy(() => import("./components/NutritionTable"));

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

const store = RootStore.create({
  nav: Navigation.create()
});

const CurrentPage = observer(() => {
  switch (store.nav.page) {
    case Page.Data:
      return (
        <React.Suspense fallback={<div>Loading...</div>}>
          <NutritionTable />
        </React.Suspense>
      );
    case Page.Foods:
      return <div>Foods</div>;
    case Page.Home:
    default:
      return <div>Home</div>;
  }
});

const App = () => (
  <div className="App" style={appStyle}>
    <React.StrictMode>
      <TopMenu store={store.nav} />
      <FlexCol>
        <FlexColItem>
          <CurrentPage />
        </FlexColItem>
      </FlexCol>
    </React.StrictMode>
  </div>
);

export default App;
