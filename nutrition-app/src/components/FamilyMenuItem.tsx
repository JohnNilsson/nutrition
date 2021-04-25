import { Menu, Icon } from "semantic-ui-react";
import { observer } from "mobx-react-lite";
import { AppState } from "../state";
import { useState } from "react";
import { FamilyMember } from "../state/FamilyMember";
import { action } from "mobx";

export interface FamilyMenuItemProps {
  state: AppState;
}
export const FamilyMenuItem = observer<FamilyMenuItemProps>(
  function FamilyMenuItem({ state }) {
    const { family, view } = state;

    const [selected, setSelected] = useState<FamilyMember|undefined>();

    return (
      <Menu.Item>
        <Icon name="users" />
        Familj
        <Menu.Menu>
          {Array.from(family, ([key, m]) => (
            <Menu.Item
              key={key}
              active={m === selected}
              onClick={() => 
                setSelected(m === selected ? undefined : m)
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
            <Icon float="left" name="plus" link onClick={action(() => {
              setSelected(state.addFamilyMember());
            })} />
          </Menu.Item>
        </Menu.Menu>
      </Menu.Item>
    );
  }
);

export default FamilyMenuItem;
