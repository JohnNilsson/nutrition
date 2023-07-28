import type { NäringsvärdeFörkortning } from "sfcd/data.json";
// Aberviations taken from the swedish food composition database
/*
SELECT DISTINCT Forkortning, Namn, Enhet FROM `Naringsvarde` ORDER BY Forkortning
Forkortning	Namn	Enhet
Alko	Alkohol	g
Aska	Aska	g
Avfa	Avfall (skal etc.)	%
C12:0	Laurinsyra C12:0	g
C14:0	Myristinsyra C14:0	g
C16:0	Palmitinsyra C16:0	g
C16:1	Palmitoljesyra C16:1	g
C18:0	Stearinsyra C18:0	g
C18:1	Oljesyra C18:1	g
C18:2	Linolsyra C18:2	g
C18:3	Linolensyra C18:3	g
C20:0	Arakidinsyra C20:0	g
C20:4	Arakidonsyra C20:4	g
C20:5	EPA (C20:5)	g
C22:5	DPA (C22:5)	g
C22:6	DHA (C22:6)	g
C4:0-C10:0	Fettsyra 4:0-10:0	g
Ca	Kalcium	mg
Dsac	Disackarider	g
Ener	Energi (kJ)	kJ
Ener	Energi (kcal)	kcal
Fe	Järn	mg
Fett	Fett	g
Fibe	Fibrer	g
Folat	Folat	µg
Fullk/tot	Fullkorn totalt	g
I	Jod	µg
K	Kalium	mg
Kole	Kolesterol	mg
Kolh	Kolhydrater	g
Mfet	Summa mättade fettsyror	g
Mg	Magnesium	mg
Mone	Summa enkelomättade fettsyror	g
Mono/disack	Socker totalt	g
Msac	Monosackarider	g
Na	Natrium	mg
NaCl	Salt	g
Niac	Niacin	mg
Niek	Niacinekvivalenter	NE/mg
P	Fosfor	mg
Pole	Summa fleromättade fettsyror	g
Prot	Protein	g
Reti	Retinol	µg
Ribo	Riboflavin	mg
Sack	Sackaros	g
Se	Selen	µg
Socker/f	Fritt socker	g
Socker/t	Tillsatt socker	g
Tiam	Tiamin	mg
Vatt	Vatten	g
VitA	Vitamin A	RE/µg
VitB12	Vitamin B12	µg
VitB6	Vitamin B6	mg
VitC	Vitamin C	mg
VitD	Vitamin D	µg
VitE	Vitamin E	mg
Zn	Zink	mg
b-Kar	β-Karoten	µg
*/

const Nutrients = {
  Mfet: "Summa mättade fettsyror",
  Mone: "Summa enkelomättade fettsyror",
  Pole: "Summa fleromättade fettsyror",
  "C4:0-C10:0": "Fettsyra 4:0-10:0",
  "C12:0": "Laurinsyra C12:0",
  "C14:0": "Myristinsyra C14:0",
  "C16:0": "Palmitinsyra C16:0",
  "C18:0": "Stearinsyra C18:0",
  "C20:0": "Arakidinsyra C20:0",
  "C16:1": "Palmitoljesyra C16:1",
  "C18:1": "Oljesyra C18:1",
  "C18:2": "Linolsyra C18:2",
  "C18:3": "Linolensyra C18:3",
  "C20:4": "Arakidonsyra C20:4",
  "C20:5": "EPA (C20:5)",
  "C22:5": "DPA (C22:5)",
  "C22:6": "DHA (C22:6)",
  Kole: "Kolesterol",
  Msac: "Monosackarider",
  Dsac: "Disackarider",
  Sack: "Sackaros",
  Ener: "Energi", // In the original data this could be either kcal or kJ, in the JSON everything is in kJ
  Aska: "Aska",
  Vatt: "Vatten",
  Avfa: "Avfall (skal etc.)",
  Kolh: "Kolhydrater",
  Prot: "Protein",
  Alko: "Alkohol",
  Fibe: "Fibrer",
  Fett: "Fett",
  P: "Fosfor",
  Fe: "Järn",
  Ca: "Kalcium",
  K: "Kalium",
  Mg: "Magnesium",
  Na: "Natrium",
  Se: "Selen",
  Zn: "Zink",
  VitA: "Vitamin A",
  Reti: "Retinol",
  VitD: "Vitamin D",
  VitE: "Vitamin E",
  "b-Kar": "β-Karoten",
  Tiam: "Tiamin",
  Ribo: "Riboflavin",
  VitC: "Vitamin C",
  Niac: "Niacin",
  Niek: "Niacinekvivalenter",
  VitB12: "Vitamin B12",
  VitB6: "Vitamin B6",
  Folat: "Folat",
  "Mono/disack": "Socker totalt",
  "Fullk/tot": "Fullkorn totalt",
  NaCl: "Salt",
  I: "Jod",
} satisfies { [key in NäringsvärdeFörkortning]: string };

export default Nutrients;
