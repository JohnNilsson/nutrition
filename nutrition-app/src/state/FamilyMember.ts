import { GetRestingEnergyExpenditure } from "../services/nnr";
import {
  KiloCalPerMegaJoule,
  KiloJoulePerGramFat,
  IdealBMI,
} from "../services/nnr/dietary-reference-values";
import { round } from "lodash-es";
import { makeAutoObservable } from "mobx";

export class FamilyMember {
  public name: string | undefined;
  public sex: "Male" | "Female" | undefined;
  public age: number | undefined;
  public height: number | undefined;
  public weight: number | undefined;
  public physicalActivityLevel: number | undefined;

  constructor(public readonly id: string) {
    makeAutoObservable(this);
  }

  get idealWeightKg() {
    const { age, weight, height } = this;
    if (age === undefined || weight === undefined || height === undefined) {
      return undefined;
    }
    if (age < 18) {
      return weight; //TODO
    }

    const m = height / 100;
    return round(IdealBMI * m * m, 1);
  }

  get dailyRestingEnergyExpenditureMJ() {
    const { sex, age, weight, height } = this;
    return sex === undefined ||
      age === undefined ||
      weight === undefined ||
      height === undefined
      ? undefined
      : round(GetRestingEnergyExpenditure(sex, age, weight, height / 100), 1);
  }

  get dailyEnergyExpenditureMJ() {
    const { physicalActivityLevel, dailyRestingEnergyExpenditureMJ } = this;
    return physicalActivityLevel === undefined ||
      dailyRestingEnergyExpenditureMJ === undefined
      ? undefined
      : round(dailyRestingEnergyExpenditureMJ * physicalActivityLevel, 1);
  }

  get dailyEnergyExpenditureKCal() {
    const { dailyRestingEnergyExpenditureMJ, physicalActivityLevel } = this;
    return dailyRestingEnergyExpenditureMJ === undefined ||
      physicalActivityLevel === undefined
      ? undefined
      : round(
          dailyRestingEnergyExpenditureMJ *
            physicalActivityLevel *
            KiloCalPerMegaJoule,
          -1
        );
  }

  get dailyEnergyExpenditureGramFat() {
    const { dailyRestingEnergyExpenditureMJ, physicalActivityLevel } = this;
    return dailyRestingEnergyExpenditureMJ === undefined ||
      physicalActivityLevel === undefined
      ? undefined
      : round(
          dailyRestingEnergyExpenditureMJ *
            physicalActivityLevel *
            KiloJoulePerGramFat,
          0
        );
  }

  get overWeightKg() {
    const { weight, idealWeightKg } = this;
    return weight === undefined || idealWeightKg === undefined
      ? undefined
      : round(weight - idealWeightKg, 1);
  }

  get overWeightFastingDays() {
    const { overWeightKg, dailyEnergyExpenditureGramFat } = this;
    return overWeightKg === undefined ||
      dailyEnergyExpenditureGramFat === undefined
      ? undefined
      : round((1000 * overWeightKg) / dailyEnergyExpenditureGramFat, 0);
  }
}
