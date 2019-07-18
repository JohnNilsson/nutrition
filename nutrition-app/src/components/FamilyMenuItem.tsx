import React from "react";
import { Menu, Icon } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { AppState } from "../state";

export interface FamilyMenuItemProps {
  state: AppState;
}
export const FamilyMenuItem = observer<FamilyMenuItemProps>(
  function FamilyMenuItem({ state: { family, view } }) {
    return (
      <Menu.Item>
        <Icon name="users" />
        Familj
        <Menu.Menu>
          {Array.from(family.members, ([key, m]) => (
            <Menu.Item
              key={key}
              active={m === view.selectedFamilyMember}
              onClick={() =>
                view.select(m === view.selectedFamilyMember ? undefined : m)
              }
            >
              <Icon
                name="edit"
                color={view.editFamilyMember === m ? "black" : "grey"}
                link
                onClick={() => view.edit(m)}
              />
              {m.name}
            </Menu.Item>
          ))}
          <Menu.Item>
            <Icon float="left" name="plus" link onClick={family.add} />
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    );
  }
);

export default FamilyMenuItem;
