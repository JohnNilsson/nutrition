import { types, Instance } from "mobx-state-tree";
import { GetRestingEnergyExpenditure } from "../services/nnr";
import { KiloCalPerMegaJoule, KiloJoulePerGramFat, IdealBMI } from "../services/nnr/dietary-reference-values";
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
    get idealWeightKg() {
      const { age, weight, height } = self;
      if (age === undefined || weight === undefined || height === undefined) {
        return undefined;
      }
      if (age < 18) {
        return weight; //TODO
      }

      const m = height / 100;
      return round(IdealBMI * m * m, 1);
    }
  }))
  .views(self => ({
    get dailyRestingEnergyExpenditureMJ() {
      const { sex, age, weight, height } = self;
      return age === undefined || weight === undefined || height === undefined
        ? undefined
        : round(GetRestingEnergyExpenditure(sex, age, weight, height / 100), 1);
    }
  }))
  .views(self => ({
    get dailyEnergyExpenditureMJ() {
      const { physicalActivityLevel, dailyRestingEnergyExpenditureMJ } = self;
      return physicalActivityLevel === undefined || dailyRestingEnergyExpenditureMJ === undefined
        ? undefined
        : round(dailyRestingEnergyExpenditureMJ * physicalActivityLevel, 1);
    }
  }))
  .views(self => ({
    get dailyEnergyExpenditureKCal() {
      const { dailyRestingEnergyExpenditureMJ, physicalActivityLevel } = self;
      return dailyRestingEnergyExpenditureMJ === undefined || physicalActivityLevel === undefined
        ? undefined
        : round(dailyRestingEnergyExpenditureMJ * physicalActivityLevel * KiloCalPerMegaJoule, -1);
    }
  }))
  .views(self => ({
    get dailyEnergyExpenditureGramFat() {
      const { dailyRestingEnergyExpenditureMJ, physicalActivityLevel } = self;
      return dailyRestingEnergyExpenditureMJ === undefined || physicalActivityLevel === undefined
        ? undefined
        : round(dailyRestingEnergyExpenditureMJ * physicalActivityLevel * KiloJoulePerGramFat, 0);
    }
  }))
  .views(self => ({
    get overWeightKg() {
      const { weight, idealWeightKg } = self;
      return weight === undefined || idealWeightKg === undefined
        ? undefined
        : round(weight - idealWeightKg, 1);
    }
  }))
  .views(self => ({
    get overWeightFastingDays() {
      const { overWeightKg, dailyEnergyExpenditureGramFat } = self;
      return overWeightKg === undefined || dailyEnergyExpenditureGramFat === undefined
        ? undefined
        : round((1000 * overWeightKg) / dailyEnergyExpenditureGramFat, 0);
    }
  }))
  ;
export interface IFamilyMember extends Instance<typeof FamilyMember> { }

export const Family = types
  .model("Family", {
    members: types.map(FamilyMember)
  })
  .views(self => ({
    get(id: number): IFamilyMember {
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
export interface IFamily extends Instance<typeof Family> { }
