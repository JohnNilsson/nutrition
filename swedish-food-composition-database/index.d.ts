interface PkRel<T> extends Array<T> {}
interface FkRel extends Array<number> {}

export interface Naringsvarde {
  Version          : string
  Grupp            : PkRel<string>,
  SenastAndrad     : PkRel<string>,
  Vardetyp         : PkRel<string>,
  Ursprung         : PkRel<string>,
  Publikation      : PkRel<string>,
  Framtagningsmetod: PkRel<string>,
  Metodtyp         : PkRel<string>,
  Referenstyp      : PkRel<string>,
  Kommentar        : PkRel<string>,
  Livsmedel: {
    Nummer : PkRel<number>,
    Namn : PkRel<string>,
    Grupp: FkRel,
    Naringsvarde: {
      [forkortning:string]: {
          Varde            : PkRel<number>,
          SenastAndrad     : FkRel,
          Vardetyp         : FkRel,
          Ursprung         : FkRel,
          Publikation      : FkRel,
          Framtagningsmetod: FkRel,
          Metodtyp         : FkRel,
          Referenstyp      : FkRel,
          Kommentar        : FkRel,
      }
    },
  },
  Naringsamne: {
    Namn       : PkRel<string>,
    Forkortning: PkRel<string>,
    Enhet      : PkRel<string>,
  },
}
