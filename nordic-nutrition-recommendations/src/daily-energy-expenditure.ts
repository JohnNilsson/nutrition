import { GetRestingEnergyExpenditure } from "./resting-energy-expenditure";

// Daily energy expenditure (MJ/d) = REE * PAL
export function GetDailyEneregyExpenditure(
  sex: "Female" | "Male",
  ageInY: number,
  weightInKg: number,
  heightInM: number,
  physicalActivityLevel: number
) {
  const ree = GetRestingEnergyExpenditure(sex, ageInY, weightInKg, heightInM);
  return ree * physicalActivityLevel;
}
