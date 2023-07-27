import XmlTransform, { Visitor } from './XmlTransform.js'
import { setNulls, n, d, id, sortByFkFrequency } from './utils.js'
import type { NäringsvärdeJson, NäringsvärdeFörkortning } from "../data/Naringsvarde.6NF.json"; 

interface CurrentFood {
  id: number
  nutrients?: number[]
}

interface CurrentNutrient {
  Namn?: string
  Forkortning?: NäringsvärdeFörkortning
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

const JoulePerKiloCal = 4184;

// Normalize to 6NF (using array index as id)
// TODO: Sort collections (either by frequency or alphanum, could help the compressor further)
// Other variants to try:
//   - JSON-LD, is it possible to have an efficient serialization with such a model?
//     OTOH, going with JSON-LD/RDF kind of implies that sending the entier database is not
//     the primary concern anymore, open world an all that.

export default class XmlTo6NFTransform extends XmlTransform<XmlTo6NFTransform> {

  public data: NäringsvärdeJson
  public currentFood: CurrentFood | null
  public currentNutrient: CurrentNutrient | null;

  protected createVisitorState(){ return this; }

  constructor() {
    super(visitor,{readableObjectMode:true});

    this.data = {
      Version          : '',
      Grupp            : [],
      SenastAndrad     : [],
      Vardetyp         : [],
      Ursprung         : [],
      Publikation      : [],
      Framtagningsmetod: [],
      Metodtyp         : [],
      Referenstyp      : [],
      Kommentar        : [],
      Livsmedel: {
        Nummer : [],
        Namn : [],
        Grupp: [],
        Naringsvarde: {} as any,
      },
      Naringsamne: {
        Namn       : [],
        Forkortning: [],
        Enhet      : [],
      },
    };

    this.currentFood = null;
    this.currentNutrient = null;
  }
}

const visitor: Visitor<XmlTo6NFTransform> = {
  LivsmedelDataset: {

    Version(version){
      this.data.Version = version;
    },

    LivsmedelsLista: {
      Livsmedel: {
        _startElement() {
          this.currentFood = {
            id: this.data.Livsmedel.Nummer.length,
          };
        },

        Nummer(text) {
          this.data.Livsmedel.Nummer[this.currentFood!.id] = Number(text);
        },

        Namn(text) {
          this.data.Livsmedel.Namn[this.currentFood!.id] = text;
        },

        ViktGram(text) {
          if(text !== '100'){
            throw new Error('Unexpected weight: ' + text);
          }
        },

        Huvudgrupp(text) {
          this.data.Livsmedel.Grupp[this.currentFood!.id] = id(text||'', this.data.Grupp);
        },

        Naringsvarden: {
          _startElement() {
            this.currentFood!.nutrients = [];
          },

          Naringsvarde: {
            _startElement() {
              this.currentNutrient = {};
            },

            Namn             (text) { this.currentNutrient!.Namn              = text; },
            Forkortning      (text) { this.currentNutrient!.Forkortning       = text as NäringsvärdeFörkortning; },
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
              let {Namn,Forkortning,Varde,Enhet,SenastAndrad,Vardetyp,Ursprung,Publikation,Framtagningsmetod,Metodtyp,Referenstyp,Kommentar} = this.currentNutrient!;
              this.currentNutrient = null;

              if(!(Forkortning && Namn && Enhet && Varde && SenastAndrad)){
                throw new Error('Unexpected lack of values');
              }

              if(Forkortning === 'Ener' && Namn === 'Energi (kcal)' && Enhet === 'kcal')
              {
                // Most values in the database is expressed as kcal integers (0-1000), but not all
                Varde = (n(Varde) * JoulePerKiloCal / 1000.0).toFixed(0);
                Namn  = 'Energi (kJ)';
                Enhet = 'kJ';
              }


              let nId = this.data.Naringsamne.Forkortning.indexOf(Forkortning);
              if(nId === -1){
                nId = this.data.Naringsamne.Forkortning.length;
                this.data.Naringsamne.Forkortning[nId] = Forkortning;
                this.data.Naringsamne.Namn       [nId] = Namn;
                this.data.Naringsamne.Enhet      [nId] = Enhet;
              } else {
                if(!(this.data.Naringsamne.Forkortning [nId] === Forkortning
                  && this.data.Naringsamne.Namn        [nId] === Namn
                  && this.data.Naringsamne.Enhet       [nId] === Enhet
                )){
                  // Convert kcal => kJ?
                  throw new Error('Unexpected value:'+JSON.stringify({Forkortning,Namn,Enhet})+'!=='+JSON.stringify({
                    Forkortning: this.data.Naringsamne.Forkortning[nId],
                    Namn: this.data.Naringsamne.Namn[nId],
                    Enhet: this.data.Naringsamne.Enhet[nId],
                  }));
                };
              }

              const fId = this.currentFood!.id;
              let nv = this.data.Livsmedel.Naringsvarde[Forkortning];
              if(nv === undefined){
                nv = {
                  Varde            : [],
                  SenastAndrad     : [],
                  Vardetyp         : [],
                  Ursprung         : [],
                  Publikation      : [],
                  Framtagningsmetod: [],
                  Metodtyp         : [],
                  Referenstyp      : [],
                  Kommentar        : [],
                };
                this.data.Livsmedel.Naringsvarde[Forkortning] = nv;
              }
              nv.Varde             [fId] = n(Varde);
              nv.SenastAndrad      [fId] = id(d(SenastAndrad)   ||'',this.data.SenastAndrad);
              nv.Vardetyp          [fId] = id(Vardetyp          ||'',this.data.Vardetyp);
              nv.Ursprung          [fId] = id(Ursprung          ||'',this.data.Ursprung);
              nv.Publikation       [fId] = id(Publikation       ||'',this.data.Publikation);
              nv.Framtagningsmetod [fId] = id(Framtagningsmetod ||'',this.data.Framtagningsmetod);
              nv.Metodtyp          [fId] = id(Metodtyp          ||'',this.data.Metodtyp);
              nv.Referenstyp       [fId] = id(Referenstyp       ||'',this.data.Referenstyp);
              nv.Kommentar         [fId] = id(Kommentar         ||'',this.data.Kommentar);
            }
          },
        },
      },
      _endElement(){
        removeFkNulls(this.data.Livsmedel, this.data);
        sortDataTablesByFkFrequency(this.data.Livsmedel, this.data);
        this.push(this.data);
        this.push(null);
      }
    }
  }
};

// Remove nulls, from large arrays, should help keep binary encodings simple
// also '0' is shorter than 'null' so might even help the json encoding
function removeFkNulls(foreignKeys: any, data: any){
  for(const key of Object.keys(foreignKeys)){
    const fkArr = foreignKeys[key];
    const dataArr = data[key];
    if(Array.isArray(fkArr)) {
      if(!Array.isArray(dataArr)){
        if(key === 'Varde'){
          //NaN won't work, json can't represent NaN
          //setNulls(fkArr,NaN);
        }
      } else {
        setNulls(fkArr,id('',dataArr));
      }
    } else if (typeof fkArr === 'object') {
      removeFkNulls(fkArr, data);
    }
  }
}

// Sort tables to keep the most frequently used fks short
// should help both with json as well as binary variable length zigzag encodings
function sortDataTablesByFkFrequency(foreignKeys: any, dataTables: any){
  for(const key of Object.keys(foreignKeys)){
    const fkArr = foreignKeys[key];
    const dataArr = dataTables[key];
    if(Array.isArray(fkArr) && Array.isArray(dataArr)) {
      sortByFkFrequency(fkArr,dataArr);
    } else if (typeof fkArr === 'object') {
      sortDataTablesByFkFrequency(fkArr, dataTables);
    }
  }
}
