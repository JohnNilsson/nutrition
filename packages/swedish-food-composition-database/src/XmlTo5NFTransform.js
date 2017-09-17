const XmlTransform = require('./XmlTransform');
const moment = require('moment-timezone');
const { nn, n, d, id } = require('./utils');

// Normalize to 5NF (using array index as id)
class XmlTo5NFTransform extends XmlTransform {

  constructor() {
    super(XmlTo5NFTransform.visitor,{readableObjectMode:true});

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
      Livsmedel        : [/*{Nummer,Namn,Grupp}*/],
      Naringsamne      : [/*{Namn,Forkortning,Enhet}*/],
      Naringsvarde     : [/*{Livsmedel,Naringsamne,Varde,SenastAndrad,Vardetyp,Ursprung,Publikation,Framtagningsmetod,Metodtyp,Referenstyp,Kommentar*/],
    };

    this.currentFood = null;
    this.currentNutrient = null;
  }
}

XmlTo5NFTransform.visitor = {
  LivsmedelDataset: {

    Version(version){
      this.data.Version = version;
    },

    LivsmedelsLista: {
      Livsmedel: {
        _startElement() {
          this.currentFood = {
            id: this.data.Livsmedel.length,
          };
        },

        Nummer(text) {
          this.currentFood.Nummer = Number(text);
        },

        Namn(text) {
          this.currentFood.Namn = text;
        },

        ViktGram(text) {
          if(text !== '100'){
            throw new Error('Unexpected weight: ' + text);
          }
        },

        Huvudgrupp(text) {
          this.currentFood.Grupp = id(text||'', this.data.Grupp);
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
            Varde            (text) { this.currentNutrient.Varde             = n(text); },
            Enhet            (text) { this.currentNutrient.Enhet             = text; },
            SenastAndrad     (text) { this.currentNutrient.SenastAndrad      = id(d(text)||'',this.data.SenastAndrad);      },
            Vardetyp         (text) { this.currentNutrient.Vardetyp          = id(text   ||'',this.data.Vardetyp);          },
            Ursprung         (text) { this.currentNutrient.Ursprung          = id(text   ||'',this.data.Ursprung);          },
            Publikation      (text) { this.currentNutrient.Publikation       = id(text   ||'',this.data.Publikation);       },
            Framtagningsmetod(text) { this.currentNutrient.Framtagningsmetod = id(text   ||'',this.data.Framtagningsmetod); },
            Metodtyp         (text) { this.currentNutrient.Metodtyp          = id(text   ||'',this.data.Metodtyp);          },
            Referenstyp      (text) { this.currentNutrient.Referenstyp       = id(text   ||'',this.data.Referenstyp);       },
            Kommentar        (text) { this.currentNutrient.Kommentar         = id(text   ||'',this.data.Kommentar);         },

            _endElement() {
              const {Namn,Forkortning,Varde,Enhet,SenastAndrad,Vardetyp,Ursprung,Publikation,Framtagningsmetod,Metodtyp,Referenstyp,Kommentar} = this.currentNutrient;
              this.currentNutrient = null;

              let nId = this.data.Naringsamne.findIndex(n => n.Forkortning === Forkortning);
              if(nId === -1){
                nId = this.data.Naringsamne.length;
                this.data.Naringsamne[nId] = nn({Forkortning,Namn,Enhet});
              }

              const fId = this.currentFood.id;

              const nv = nn({
                Livsmedel: fId,
                Naringsamne: nId,
                Varde,
                SenastAndrad,
                Vardetyp,
                Ursprung,
                Publikation,
                Framtagningsmetod,
                Metodtyp,
                Referenstyp,
                Kommentar
              });
              const nvId = this.data.Naringsvarde.length;
              this.data.Naringsvarde[nvId] = nv;

              if(!Varde && Varde != 0){
                const {inspect} = require('util');
                console.error('Null Varde:', inspect({
                  Varde,
                  Livsmedel: this.currentFood,
                  Naringsamne: this.data.Naringsamne[nv.Naringsamne],
                  Naringsvarde: nv
                }));
              }
            }
          },
        },
        _endElement(){
          this.data.Livsmedel[this.currentFood.id] = nn({
            Nummer: this.currentFood.Nummer,
            Namn:   this.currentFood.Namn,
            Grupp:  this.currentFood.Grupp,
          });
        }
      },
      _endElement(){
        this.push(this.data);
        this.push(null);
      }
    }
  }
};

module.exports = XmlTo5NFTransform;
