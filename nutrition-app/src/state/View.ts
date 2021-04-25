import { makeAutoObservable } from "mobx";
import { FamilyMember } from "./FamilyMember";

export class View {

  public editFamilyMember?: FamilyMember

  constructor() { makeAutoObservable(this); }

  edit(member: FamilyMember | undefined) {
    this.editFamilyMember = member;
  }
}
