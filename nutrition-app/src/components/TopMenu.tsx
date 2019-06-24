import React, { Component } from "react";
import { observer } from "mobx-react";
import { Input, Menu } from "semantic-ui-react";
import { Navigation, Page } from "../state/Navigation";

const MAIN = "hem";
const FOODS = "mat";
const DATA = "data";

@observer
export default class TopMenu extends Component<{
  store: typeof Navigation.Type;
}> {
  render() {
    const { page, go } = this.props.store;

    return (
      <Menu>
        <Menu.Item
          icon="home"
          name={MAIN}
          active={page === Page.Home}
          onClick={() => go(Page.Home)}
        />
        <Menu.Item
          icon="food"
          name={FOODS}
          active={page === Page.Foods}
          onClick={() => go(Page.Foods)}
        />
        <Menu.Item
          icon="database"
          name={DATA}
          active={page === Page.Data}
          onClick={() => go(Page.Data)}
        />
        <Menu.Menu position="right">
          <Menu.Item>
            <Input icon="search" placeholder="Search..." />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    );
  }
}
