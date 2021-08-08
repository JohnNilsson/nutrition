// Resting Energy Expenditure, REE (MJ/d) = Ww (kg) + Hh (m) + C
// [W,H,C]
const REE = {
  Female: {
    "0-2": [0.127, 2.94, -1.2],
    "3-10": [0.0666, 0.878, 1.46],
    "11-18": [0.0393, 1.04, 1.93],
    "19-30": [0.0433, 2.57, -1.18],
    "31-60": [0.0342, 2.1, -0.0486],
    "61+": [0.0356, 1.76, 0.0448],
  },
  Male: {
    "0-2": [0.118, 3.59, -1.55],
    "3-10": [0.0632, 1.31, 1.28],
    "11-18": [0.0651, 1.11, 1.25],
    "19-30": [0.06, 1.31, 0.473],
    "31-60": [0.0476, 2.26, -0.574],
    "61+": [0.0478, 2.26, -1.07],
  },
} as const;

type Sex = keyof typeof REE;
type EEAgeRange = keyof typeof REE[Sex];

function GetEEAgeRange(age: number): EEAgeRange {
  if (age < 3) return "0-2";
  if (age < 11) return "3-10";
  if (age < 19) return "11-18";
  if (age < 31) return "19-30";
  if (age < 61) return "31-60";
  return "61+";
}

export function GetRestingEnergyExpenditure(
  sex: Sex,
  ageInY: number,
  weightInKg: number,
  heightInM: number
) {
  const [W, H, C] = REE[sex][GetEEAgeRange(ageInY)];
  return W * weightInKg + H * heightInM + C;
}
