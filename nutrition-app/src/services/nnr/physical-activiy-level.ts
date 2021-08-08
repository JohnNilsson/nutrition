const PAL = {
  "1-3": {
    Low: 1.35,
    Average: 1.39,
    High: 1.43,
  },
  "4-9": {
    Low: 1.42,
    Average: 1.57,
    High: 1.69,
  },
  "10-18": {
    Low: 1.66,
    Average: 1.73,
    High: 1.85,
  },
  "18+": {
    Low: 1.4, // Totally sedentary lifestyle
    Average: 1.6, // Unhealthy, but average
    High: 1.8, // Healthy, 75th percentile
  },
};

type PalAgeRange = keyof typeof PAL;
type PalLevel = keyof typeof PAL[PalAgeRange];

function GetPalAgeRange(age: number): PalAgeRange {
  if (age < 4) return "1-3";
  if (age < 10) return "4-9";
  if (age < 18) return "10-18";
  return "18+";
}

export function GetPhysicalActivityLevel(ageInY: number, level: PalLevel) {
  return PAL[GetPalAgeRange(ageInY)][level];
}
