import { types, getRoot, Instance, onPatch } from "mobx-state-tree";
import { IAppState } from "./";
import { FamilyMember, IFamilyMember } from "./Family";

export const View = types
  .model("View", {
    selectedFamilyMember: types.safeReference(FamilyMember),
    editFamilyMember: types.safeReference(FamilyMember)
  })
  .views(self => ({
    get app(): IAppState {
      return getRoot(self);
    }
  }))
  .actions(self => ({
    select(member: IFamilyMember | undefined) {
      self.selectedFamilyMember = member;
    },
    edit(member: IFamilyMember | undefined) {
      self.editFamilyMember = member;
    }
  }))
  .actions(self => ({
    afterAttach() {
      onPatch(self.app.family.members, patch => {
        if(patch.op === "add" && FamilyMember.is(patch.value)) {
          var ref = self.app.family.members.get(String(patch.value.id));
          self.edit(ref);
        }
      });
    }
  }));
export interface IView extends Instance<typeof View> {}
