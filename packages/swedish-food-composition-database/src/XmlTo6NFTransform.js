const XmlTransform = require('./XmlTransform');
const { setNulls, n, d, id, sortByFkFrequency } = require('./utils');

// Normalize to 6NF (using array index as id)
// TODO: Sort collections (either by frequency or alphanum, could help the compressor further)
// Other variants to try:
//   - JSON-LD, is it possible to have an efficient serialization with such a model?
//     OTOH, going with JSON-LD/RDF kind of implies that sending the entier database is not
//     the primary concern anymore, open world an all that.
class XmlTo6NFTransform extends XmlTransform {

  constructor() {
    super(XmlTo6NFTransform.visitor,{readableObjectMode:true});

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
        Naringsvarde: {
          // <Forkortning>: {
            //   Varde            : [],
            //   SenastAndrad     : [],
            //   Vardetyp         : [],
            //   Ursprung         : [],
            //   Publikation      : [],
            //   Framtagningsmetod: [],
            //   Metodtyp         : [],
            //   Referenstyp      : [],
            //   Kommentar        : [],
            // }
        },
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

XmlTo6NFTransform.visitor = {
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
          this.data.Livsmedel.Nummer[this.currentFood.id] = Number(text);
        },

        Namn(text) {
          this.data.Livsmedel.Namn[this.currentFood.id] = text;
        },

        ViktGram(text) {
          if(text !== '100'){
            throw new Error('Unexpected weight: ' + text);
          }
        },

        Huvudgrupp(text) {
          this.data.Livsmedel.Grupp[this.currentFood.id] = id(text||'', this.data.Grupp);
        },

        Naringsvarden: {
          _startElement() {
            this.currentFood.nutrients = [];
          },

          Naringsvarde: {
            _startElement() {
              this.currentNutrient = {};
            },

            Namn             (text) { this.currentNutrient.Namn              = text; },
            Forkortning      (text) { this.currentNutrient.Forkortning       = text; },
            Varde            (text) { this.currentNutrient.Varde             = text; },
            Enhet            (text) { this.currentNutrient.Enhet             = text; },
            SenastAndrad     (text) { this.currentNutrient.SenastAndrad      = text; },
            Vardetyp         (text) { this.currentNutrient.Vardetyp          = text; },
            Ursprung         (text) { this.currentNutrient.Ursprung          = text; },
            Publikation      (text) { this.currentNutrient.Publikation       = text; },
            Framtagningsmetod(text) { this.currentNutrient.Framtagningsmetod = text; },
            Metodtyp         (text) { this.currentNutrient.Metodtyp          = text; },
            Referenstyp      (text) { this.currentNutrient.Referenstyp       = text; },
            Kommentar        (text) { this.currentNutrient.Kommentar         = text; },

            _endElement() {
              const {Namn,Forkortning,Varde,Enhet,SenastAndrad,Vardetyp,Ursprung,Publikation,Framtagningsmetod,Metodtyp,Referenstyp,Kommentar} = this.currentNutrient;
              this.currentNutrient = null;

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
                  throw new Error('Unexpected value:'+JSON.stringify({Forkortning,Namn,Enhet,Vardetyp}));
                };
              }

              const fId = this.currentFood.id;
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
function removeFkNulls(foreignKeys, data){
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
function sortDataTablesByFkFrequency(foreignKeys, dataTables){
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

module.exports = XmlTo6NFTransform;
