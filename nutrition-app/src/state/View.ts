import { types, getRoot, Instance } from "mobx-state-tree";
import { AppState } from "./";
import { FamilyMember } from "./Family";

export const View = types
  .model("View", {
    selectedFamilyMember: types.safeReference(FamilyMember),
    editFamilyMember: types.safeReference(FamilyMember)
  })
  .views(self => ({
    get app(): AppState {
      return getRoot(self);
    }
  }))
  .actions(self => ({
    select(member: FamilyMember | undefined) {
      self.selectedFamilyMember = member;
    },
    edit(member: FamilyMember | undefined) {
      self.editFamilyMember = member;
    }
  }))
  .actions(self => ({
    afterAttach() {
      self.app.family.members.observe(changes => {
        if (changes.type === "add") {
          // TODO: For some reason newValue here isn't, as the type suggests, an instance
          // I think this code snippet, replaces the element with some internal node thingie
          // case "add":
          // {
          //   typecheckInternal(subType, change.newValue);
          //   change.newValue = subType.instantiate(node, key, undefined, change.newValue);
          //   mapType.processIdentifier(key, change.newValue);
          // }

          if (FamilyMember.is(changes.newValue)) {
            self.edit(changes.newValue);
          } else {
            self.edit((changes.newValue as any).storedValue);
          }
        }
      });
    }
  }));
export interface View extends Instance<typeof View> {}
