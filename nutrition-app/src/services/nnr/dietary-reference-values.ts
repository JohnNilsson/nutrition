type Expression = Var | ExpressionTuple;
type Var = string;
type ExpressionOp = "+" | "*";
interface ExpressionTuple extends Array<ExpressionOp | Expression> {
  0: ExpressionOp;
  1: Expression;
  2: Expression;
}

type ContraintOp = "<=" | ">=";
type ConstraintStrength = "weak" | "medium" | "string";
export interface Constraint
  extends Array<Var | ContraintOp | Expression | ConstraintStrength> {
  0: Var;
  1: ContraintOp;
  2: Expression;
  3: ConstraintStrength;
}

export const JoulePerKiloCal = 4184;
export const KiloCalPerMegaJoule = 1000000/JoulePerKiloCal;
export const KiloJoulePerGramFat = 37;

export const IdealBMI = 22.5; //22-23
export const ReferenceBMI = 23;

const Constraints = {
  // Vars taken from the swedish food composition database
  // "Mfet": "Summa mättade fettsyror",
  // "Mone": "Summa enkelomättade fettsyror",
  // "Pole": "Summa fleromättade fettsyror",
  // "C16:1": "Palmitoljesyra C16:1",
  // "C18:1": "Oljesyra C18:1",
  // "C18:2": "Linolsyra C18:2",
  // "C18:3": "Linolensyra C18:3",
  // "C20:4": "Arakidonsyra C20:4",
  // "C20:5": "EPA (C20:5)",
  // "C22:5": "DPA (C22:5)",
  // "C22:6": "DHA (C22:6)",
  // "Kole": "Kolesterol",
  // "Msac": "Monosackarider",
  // "Dsac": "Disackarider",
  // "Sack": "Sackaros",
  // "Enkj": "Energi (kJ)",
  // "Ener": "Energi (kcal)",
  // "Aska": "Aska",
  // "Vatt": "Vatten",
  // "Kolh": "Kolhydrater",
  // "Prot": "Protein",
  // "Alko": "Alkohol",
  // "Fibe": "Fibrer",
  // "Fett": "Fett",
  // "P": "Fosfor",
  // "Fe": "Järn",
  // "Ca": "Kalcium",
  // "K": "Kalium",
  // "Mg": "Magnesium",
  // "Na": "Natrium",
  // "Se": "Selen",
  // "Zn": "Zink",
  // "VitA": "Vitamin A",
  // "Reti": "Retinol",
  // "VitD": "Vitamin D",
  // "VitE": "Vitamin E",
  // "b-Kar": "β-Karoten",
  // "Tiam": "Tiamin",
  // "Ribo": "Riboflavin",
  // "VitC": "Vitamin C",
  // "Niac": "Niacin",
  // "Niek": "Niacinekvivalenter",
  // "VitB12": "Vitamin B12",
  // "VitB6": "Vitamin B6",
  // "Folat": "Folat",
  // "Mono/disack": "Socker totalt",
  // "Fullk/tot": "Fullkorn totalt",
  // "NaCl": "Salt",
  // "I": "Jod"

  // "REE" and "PAL" should be derived from Energy-factors above
  Vars: {
    EEMj: ["*", "REE", "PAL"],
    EE: ["*", 1000, "EEMj"],
    EProt: ["*", 17, "Prot"],
    EKolh: ["*", 17, "Kolh"],
    EFett: ["*", KiloJoulePerGramFat, "Fett"],
    EFibe: ["*", 8, "Fibe"],
    EAlko: ["*", 29, "Alko"],
    EMfet: ["*", KiloJoulePerGramFat, "MFet"],
    EMone: ["*", KiloJoulePerGramFat, "Mone"],
    EPole: ["*", KiloJoulePerGramFat, "Pole"],
    EUFA: ["+", "EMone", "EPole"],
    "n-3": ["+", "C20:5", "C22:5", "C22:6"],
    "En-3": ["*", KiloJoulePerGramFat, "n-3"],
    EFA: ["+", "C18:2", "C18:3"],
    EEFA: ["*", KiloJoulePerGramFat, "EFA"],
    EALA: ["*", KiloJoulePerGramFat, "C18:3"],
    ETot1: ["+", "EProt", "EFett", "EKolh"], // NNR calculation
    Etot2: ["+", "Enkj"] // Swedish Food Composition Database
  },
  Recommendations: [
    //
    // Fat and fatty acids
    //

    // Intake of SFA should be limited to less than 10 E% calculated as triglycerides
    ["EMfet", "<=", ["*", 0.1, "EE"], "strong"],
    // Cis-MUFA should contribute 10–20 E%
    ["EMone", ">=", ["*", 0.1, "EE"], "medium"],
    ["EMone", "<=", ["*", 0.2, "EE"], "medium"],
    // Intake of cis-PUFA (the sum of n-6 and n-3 fatty acids) should contribute 5–10 E%,
    ["EPole", ">=", ["*", 0.05, "EE"], "medium"],
    ["EPole", "<=", ["*", 0.1, "EE"], "medium"],
    // including at least 1 E% from n-3 fatty acids
    ["En-3", ">=", ["*", 0.01, "EE"], "strong"],
    // An intake of EPA + DHA up to 200–250 mg per day has been associated with decreased risk of CVD
    ["n-3", ">=", 0.25, "weak"],
    ["n-3", ">=", 0.2, "strong"],
    // Intake of cis-MUFA and cis-PUFA should make up at least two thirds of the total fatty acids
    ["EUFA", ">=", ["*", 0.66, "EFett"], "medium"],
    // The recommendation for EFA, i.e. LA and ALA, is 3 E%,
    ["EEFA", ">=", ["*", 0.03, "EE"], "medium"],
    // of which at least 0.5 E% should be ALA
    ["EALA", ">=", ["*", 0.005, "EE"], "strong"],
    // The upper intake range for total PUFA intake is 10 E%
    ["EPole", "<=", ["*", 0.1, "EE"], "strong"],
    // A  limitation  of  the  total  fat  intake  will  facilitate  achieving  the  recommended intakes of certain micronutrients and dietary fibre
    ["EFett", "<=", ["*", 0.4, "EE"], "medium"],
    // For dietary planning purposes, a suitable target is the middle value of the range, i.e. about 32–33 E%
    ["EFett", ">=", ["*", 0.32, "EE"], "weak"],
    ["EFett", "<=", ["*", 0.33, "EE"], "weak"],

    //
    // Carbohydrates
    //

    // Added sugars (sucrose, fructose, and starch hydrolysates) should be kept below 10 E%
    ["Mono/disack", "<=", ["*", 0.1, "EE"], "strong"],

    // For now encoding choice as a nive list of age-ranges
    {
      // Adults: Intake of dietary fibre should be at least 25–35 g/d, i.e. approximately 3 g/MJ. Wholegrain cereals, whole fruit, vegetables, pulses, and nuts should be the major sources.
      "18+": [["Fibe", ">=", ["*", 0.003, "EE"], "medium"]],

      // Children: An intake corresponding to 2–3 g/MJ is appropriate for children from 2 years of age. From school age the intake should gradually increase to reach the recommended adult level during adolescence.
      "2-6": [
        ["Fibe", ">=", ["*", 0.002, "EE"], "medium"],
        ["Fibe", "<=", ["*", 0.003, "EE"], "medium"]
      ],
      "7-17": [
        [
          "Fibe",
          ">=",
          ["*", ["+", 0.002, ["*", 0.0001, "Age"]], "EE"],
          "medium"
        ],
        ["Fibe", "<=", ["*", 0.003, "EE"], "weak"]
      ]
    },

    // Based  on  the  available  evidence,  and  according  to  the  Nordic  dietary  habits, a protein intake corresponding to 10–20 E% is recommended. Thus, the recommended range is the same as in NNR 2004.
    // This recommendation takes into account the po-tential harmful effects of a long-term dietary protein intake above 20–23 E% seen in studies with protein per se and with LC/HP and/or high-fat diets,  the  caveat  from  renal  function  studies,  and  a  consideration  of  the  recommendations for fat and carbohydrates.
    ["EProt", ">=", ["*", 0.1, "EE"], "medium"],
    ["EProt", "<=", ["*", 0.2, "EE"], "strong"],

    // With decreasing energy intake below 8 MJ (e.g., decreased physical activity or during intentional weight loss), the protein E% should increase accordingly and still correspond about 1.1 g protein/kg BW/d.
    ["Prot", ">=", ["*", 1.1, "W"], "strong"],

    {
      // The recommendations for protein intake in children in the NNR 2012 are the same as in the NNR 2004, i.e. 7–15 E% from 6 to 11 months of age,  10–15  E%  for  12  to  23  months  of  age,  and  10–20  E%  for  2  to  17  years of age.
      // The fol-lowing upper ranges for protein intake are suggested, assuming sufficient intake of other nutrients: 0–6 months, 10 E%; 6–11 months, 15 E%; 12–23 months, 17 E%; and 2 years and older, 20 E%.
      "0-1": [
        ["EProt", "<=", ["*", ["+", 0.1, ["*", 0.1, "Age"]], "EE"], "strong"]
      ],
      "2-64": [
        // For food planning purposes with energy intake in the range of 8–12 MJ,  an  appropriate  target  is  15  E%
        ["EProt", ">=", ["*", 0.15, "EE"], "weak"],
        ["EProt", "<=", ["*", 0.15, "EE"], "weak"]
      ],
      "65+": [
        // an intake corresponding to 15–20 E% is recommended for the elderly.
        ["EProt", ">=", ["*", 0.15, "EE"], "strong"],
        // For food planning purposes, the recommendation is 18 E%, which corresponds to about 1.2 g protein/kg BW/d.
        ["EProt", ">=", ["*", 0.18, "EE"], "weak"],
        ["EProt", "<=", ["*", 0.18, "EE"], "weak"]
      ]
    }
  ]
};
