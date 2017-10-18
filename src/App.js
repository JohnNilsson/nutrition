import * as React from 'react';
import {
  Divider,
  Menu,
} from 'semantic-ui-react';

import FoodSearch     from './components/FoodSearch';
import NutritionStats from './components/NurtitionStats';
import SelectedFoods  from './components/SelectedFoods';

import './App.css';

const App = () => (
  <div className="App">
    <Menu vertical fixed="left">
      <Menu.Item>
        <FoodSearch />
      </Menu.Item>
    </Menu>
    <div style={{marginLeft:"15rem", height:"100%"}}>
      <SelectedFoods />
      <Divider horizontal>Stats</Divider>
      <NutritionStats />
    </div>
  </div>
);

export default App;
