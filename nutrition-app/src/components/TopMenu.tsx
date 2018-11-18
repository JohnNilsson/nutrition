import React, { Component } from 'react'
import { Input, Menu, MenuItemProps } from 'semantic-ui-react'

const MAIN  = 'hem';
const FOODS = 'mat';

export default class TopMenu extends Component {
  state = { activeItem: MAIN }

  handleItemClick: (event: React.MouseEvent<HTMLAnchorElement>, data: MenuItemProps) => void
  = (e, { name }) => this.setState({ activeItem: name })

  render() {
    const { activeItem } = this.state

    return (
      <Menu>
        <Menu.Item icon='home' name={MAIN}  active={activeItem === MAIN } onClick={this.handleItemClick} />
        <Menu.Item icon='food' name={FOODS} active={activeItem === FOODS} onClick={this.handleItemClick} />
        <Menu.Menu position='right'>
          <Menu.Item>
            <Input icon='search' placeholder='Search...' />
          </Menu.Item>
        </Menu.Menu>
      </Menu>
    )
  }
}
