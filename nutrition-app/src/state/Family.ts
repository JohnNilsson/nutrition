import { types, Instance } from "mobx-state-tree";
import { GetRestingEnergyExpenditure } from "../services/nnr";
import { round } from "lodash-es";

export const FamilyMember = types
  .model("FamilyMember", {
    id: types.identifierNumber,
    name: types.maybe(types.string),
    sex: types.enumeration<"Male" | "Female">("Sex", ["Male", "Female"]),
    age: types.maybe(types.number),
    height: types.maybe(types.number),
    weight: types.maybe(types.number),
    physicalActivityLevel: types.maybe(types.number)
  })
  .actions(self => ({
    setName(name: string | undefined) {
      self.name = name;
    },
    setSex(sex: typeof self.sex) {
      self.sex = sex;
    },
    setAge(age: number | undefined) {
      self.age = age;
    },
    setHeight(height: number | undefined) {
      self.height = height;
    },
    setWeight(weight: number | undefined) {
      self.weight = weight;
    },
    setPhysicalActivityLevel(pal: number | undefined) {
      self.physicalActivityLevel = pal;
    }
  }))
  .views(self => ({
    get restingEnergyExpenditure() {
      const { sex, age, weight, height } = self;
      return age === undefined || weight === undefined || height === undefined
        ? undefined
        : round(GetRestingEnergyExpenditure(sex, age, weight, height / 100), 2);
    }
  }))
  .views(self => ({
    get dailyEnergyExpenditure() {
      return self.physicalActivityLevel === undefined ||
        self.restingEnergyExpenditure === undefined
        ? 0
        : round(self.restingEnergyExpenditure * self.physicalActivityLevel, 2);
    }
  }));
export interface FamilyMember extends Instance<typeof FamilyMember> {}

export const Family = types
  .model("Family", {
    members: types.map(FamilyMember)
  })
  .views(self => ({
    get(id: number): FamilyMember {
      const member = self.members.get(String(id));
      if (member === undefined) {
        throw new Error(`FamilyMember ${id} not found`);
      }
      return member;
    }
  }))
  .actions(self => ({
    add() {
      // Next free identifier
      let id = -1;
      self.members.forEach(m => {
        id = Math.max(id, m.id);
      });
      id++;

      self.members.put(
        FamilyMember.create({
          id,
          name: "P" + id,
          sex: "Male"
        })
      );
    },

    remove(id: number) {
      self.members.delete(String(id));
    }
  }));
export interface Family extends Instance<typeof Family> {}
