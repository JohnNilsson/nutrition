import XmlTransform, { Visitor } from './XmlTransform.js'

interface CurrentFood {
  Nummer?: string
  Namn?: string
  ViktGram?: string
  Huvudgrupp?: string
}

interface CurrentNutrient {
  Namn?: string
  Forkortning?: string
  Varde?: string
  Enhet?: string
  SenastAndrad?: string
  Vardetyp?: string
  Ursprung?: string
  Publikation?: string
  Framtagningsmetod?: string
  Metodtyp?: string
  Referenstyp?: string
  Kommentar?: string
}

export default class XmlTo6NFTransform extends XmlTransform<XmlTo6NFTransform> {

  public currentFood: CurrentFood | null
  public currentNutrient: CurrentNutrient | null;

  protected createVisitorState(){ return this; }

  constructor() {
    super(visitor);
    this.currentFood = null;
    this.currentNutrient = null;
  }
}

const visitor: Visitor<XmlTo6NFTransform> = {
  LivsmedelDataset: {
    _startElement()  {
      this.push(`
CREATE TABLE Livsmedel (
  Nummer INTEGER,
  Namn TEXT,
  ViktGram TEXT,
  Huvudgrupp TEXT,
  PRIMARY KEY (Nummer ASC)
) WITHOUT ROWID;
CREATE TABLE Naringsvarde (
  Livsmedel INTEGER,
  Namn TEXT,
  Forkortning TEXT,
  Varde TEXT,
  Enhet TEXT,
  SenastAndrad TEXT,
  Vardetyp TEXT,
  Ursprung TEXT,
  Publikation TEXT,
  Framtagningsmetod TEXT,
  Metodtyp TEXT,
  Referenstyp TEXT,
  Kommentar TEXT,
  PRIMARY KEY (Livsmedel ASC, Namn ASC)
) WITHOUT ROWID;
BEGIN TRANSACTION;
`);
    },


    Version(version){},

    LivsmedelsLista: {
      Livsmedel: {
        _startElement()  { this.currentFood = {}; },

        Nummer(text)     { this.currentFood!.Nummer     = text; },
        Namn(text)       { this.currentFood!.Namn       = text; },
        ViktGram(text)   { this.currentFood!.ViktGram   = text; },
        Huvudgrupp(text) { this.currentFood!.Huvudgrupp = text; },

        _endElement() {
          const {Nummer,Namn,ViktGram,Huvudgrupp} = this.currentFood!;
          const values = [Nummer,Namn,ViktGram,Huvudgrupp];
          this.push(`INSERT INTO Livsmedel VALUES ('${values.map(v => v?.replaceAll("'","''")).join("','")}');\n`);
          this.currentFood = null;
        },

        Naringsvarden: {
          Naringsvarde: {
            _startElement() { this.currentNutrient = {}; },

            Namn             (text) { this.currentNutrient!.Namn              = text; },
            Forkortning      (text) { this.currentNutrient!.Forkortning       = text; },
            Varde            (text) { this.currentNutrient!.Varde             = text; },
            Enhet            (text) { this.currentNutrient!.Enhet             = text; },
            SenastAndrad     (text) { this.currentNutrient!.SenastAndrad      = text; },
            Vardetyp         (text) { this.currentNutrient!.Vardetyp          = text; },
            Ursprung         (text) { this.currentNutrient!.Ursprung          = text; },
            Publikation      (text) { this.currentNutrient!.Publikation       = text; },
            Framtagningsmetod(text) { this.currentNutrient!.Framtagningsmetod = text; },
            Metodtyp         (text) { this.currentNutrient!.Metodtyp          = text; },
            Referenstyp      (text) { this.currentNutrient!.Referenstyp       = text; },
            Kommentar        (text) { this.currentNutrient!.Kommentar         = text; },

            _endElement() {
              const Livsmedel = this.currentFood!.Nummer;
              const {Namn,Forkortning,Varde,Enhet,SenastAndrad,Vardetyp,Ursprung,Publikation,Framtagningsmetod,Metodtyp,Referenstyp,Kommentar} = this.currentNutrient!;
              const values = [Livsmedel,Namn,Forkortning,Varde,Enhet,SenastAndrad,Vardetyp,Ursprung,Publikation,Framtagningsmetod,Metodtyp,Referenstyp,Kommentar];
              this.push(`INSERT INTO Naringsvarde VALUES ('${values.map(v => v?.replaceAll("'","''")).join("','")}');\n`);
              this.currentNutrient = null;
            }
          },
        },
      },
      _endElement(){
        this.push('END TRANSACTION;')
        this.push(null);
      }
    }
  }
};
