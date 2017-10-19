import * as React from 'react';
import {
  Menu,
} from 'semantic-ui-react';

import FoodSearch     from './components/FoodSearch';
import NutritionStats from './components/NurtitionStats';
import SelectedFoods  from './components/SelectedFoods';

import 'semantic-ui-css/semantic.min.css';

const appStyle = {
  height: "100vh",
  paddingLeft: "15rem",
};

const floxColStyles = {
  height: "100%",
  display: "flex",
  flexDirection: "column"
};

const FlexCol = ({children}) =>
  <div style={floxColStyles}>{children}</div>

const flexColItemStyle = {
  flex: "1"
};
FlexCol.Item = ({children}) =>
  <div style={flexColItemStyle}>{children}</div>

const App = () => (
  <div className="App" style={appStyle}>
    <Menu vertical fixed="left">
      <Menu.Item>
        <FoodSearch />
      </Menu.Item>
    </Menu>
    <FlexCol>
      <FlexCol.Item>
        <SelectedFoods />
      </FlexCol.Item>
      <FlexCol.Item>
        <NutritionStats />
      </FlexCol.Item>
    </FlexCol>
  </div>
);

export default App;
