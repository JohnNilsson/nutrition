import * as React from "react";

import { List, Search } from "semantic-ui-react";

const SelectedFood = () => (
  <>
    <Search />
    <List>
      <List.Item>
        <List.Header>Broccoli</List.Header>
        11 g
      </List.Item>
    </List>
  </>
);

export default SelectedFood;
