const XmlTransform = require('./XmlTransform');
const moment = require('moment-timezone');

// Normalize to 6NF (using array index as id)
// TODO: Sort collections (either by frequency or alphanum, could help the compressor further)
// Other variants to try:
//   - 1NF with seperate strings table
//   - BCNF
//   - 5NF
// Use https://github.com/erikolson186/relational.js or http://alasql.org/ for those
//   - JSON-LD, is it possible to have an efficient serialization with such a model?
//     OTOH, going with JSON-LD/RDF kind of implies that sending the entier database is not
//     the primary concern anymore, open world an all that.
class XmlTo6NFTransform extends XmlTransform {

  constructor() {
    super(XmlTo6NFTransform.visitor,{readableObjectMode:true});

    this.data = {
      Version: '',
      Grupp: {
        Namn: [],
      },
      Naringsamne: {
        Namn       : [],
        Forkortning: [],
        Enhet      : [],
      },
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
          this.data.Livsmedel.Grupp[this.currentFood.id] = id(text, this.data.Grupp.Namn);
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
              nv.Varde             [fId] = Number(Varde);
              nv.SenastAndrad      [fId] = id(d(SenastAndrad),this.data.SenastAndrad);
              nv.Vardetyp          [fId] = id(Vardetyp,this.data.Vardetyp);
              nv.Ursprung          [fId] = id(Ursprung,this.data.Ursprung);
              nv.Publikation       [fId] = id(Publikation,this.data.Publikation);
              nv.Framtagningsmetod [fId] = id(Framtagningsmetod,this.data.Framtagningsmetod);
              nv.Metodtyp          [fId] = id(Metodtyp,this.data.Metodtyp);
              nv.Referenstyp       [fId] = id(Referenstyp,this.data.Referenstyp);
              nv.Kommentar         [fId] = id(Kommentar,this.data.Kommentar);
            }
          },
        },
      },
      _endElement(){
        this.push(this.data);
        this.push(null);
      }
    }
  }
};

function d(dateString){
  return moment.tz(dateString,"Europe/Stockholm").toJSON()
}

function id(value,array) {

  let id = array.indexOf(value);

  if(id === -1){
    id = array.length;
    array[id] = value;
  }

  return id;
}

module.exports = XmlTo6NFTransform;
