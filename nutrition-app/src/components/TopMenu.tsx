import React from "react";
import { observer } from "mobx-react-lite";
import { Menu } from "semantic-ui-react";
import { Page } from "../state/Navigation";
import { useStore } from "../store";

const MAIN = "hem";
const FOODS = "mat";
const DATA = "data";

const TopMenu = observer(() => {
  const nav = useStore().nav;
  return (
    <Menu>
      <Menu.Item
        icon="home"
        name={MAIN}
        active={nav.page === Page.Home}
        onClick={() => nav.go(Page.Home)}
      />
      <Menu.Item
        icon="food"
        name={FOODS}
        active={nav.page === Page.Foods}
        onClick={() => nav.go(Page.Foods)}
      />
      <Menu.Item
        icon="database"
        name={DATA}
        active={nav.page === Page.Data}
        onClick={() => nav.go(Page.Data)}
      />
    </Menu>
  );
});

export default TopMenu;
