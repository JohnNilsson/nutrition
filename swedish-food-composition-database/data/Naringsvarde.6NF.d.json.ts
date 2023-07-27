// A PkRel or "Primary Keyed Relation" represent Entity -> Value mappings for a particular Attribute
interface PkRel<T> extends Array<T> { }

// A FkRel or "Foreign Keyed Relation" represent Entuty -> Entity mappings
interface FkRel extends Array<number> { }

// PkRels at the root level basically represent single attributed entity type and are mostly a way to collect strings as enums
// Otherwise PkRels grouped inside an object represent the different attributes of the same entity

export type NäringsvärdeFörkortning =
  | "Mfet"
  | "Mone"
  | "Pole"
  | "C4:0-C10:0"
  | "C12:0"
  | "C14:0"
  | "C16:0"
  | "C18:0"
  | "C20:0"
  | "C16:1"
  | "C18:1"
  | "C18:2"
  | "C18:3"
  | "C20:4"
  | "C20:5"
  | "C22:5"
  | "C22:6"
  | "Kole"
  | "Msac"
  | "Dsac"
  | "Sack"
  | "Ener"
  | "Aska"
  | "Vatt"
  | "Avfa"
  | "Kolh"
  | "Prot"
  | "Alko"
  | "Fibe"
  | "Fett"
  | "P"
  | "Fe"
  | "Ca"
  | "K"
  | "Mg"
  | "Na"
  | "Se"
  | "Zn"
  | "VitA"
  | "Reti"
  | "VitD"
  | "VitE"
  | "b-Kar"
  | "Tiam"
  | "Ribo"
  | "VitC"
  | "Niac"
  | "Niek"
  | "VitB12"
  | "VitB6"
  | "Folat"
  | "Mono/disack"
  | "Fullk/tot"
  | "NaCl"
  | "I";

export interface NäringsvärdeJson {
  Version: string;
  Grupp: PkRel<string>;
  SenastAndrad: PkRel<string>;
  Vardetyp: PkRel<string>;
  Ursprung: PkRel<string>;
  Publikation: PkRel<string>;
  Framtagningsmetod: PkRel<string>;
  Metodtyp: PkRel<string>;
  Referenstyp: PkRel<string>;
  Kommentar: PkRel<string>;
  Livsmedel: {
    Nummer: PkRel<number>;
    Namn: PkRel<string>;
    Grupp: FkRel;
    Naringsvarde: {
      [forkortning in NäringsvärdeFörkortning]: {
        Varde: PkRel<number | null>; // TODO: should filter out null values
        SenastAndrad: FkRel;
        Vardetyp: FkRel;
        Ursprung: FkRel;
        Publikation: FkRel;
        Framtagningsmetod: FkRel;
        Metodtyp: FkRel;
        Referenstyp: FkRel;
        Kommentar: FkRel;
      };
    };
  };
  Naringsamne: {
    Namn: PkRel<string>;
    Forkortning: PkRel<NäringsvärdeFörkortning>;
    Enhet: PkRel<string>;
  };
};

declare const json: NäringsvärdeJson;
export default json;
