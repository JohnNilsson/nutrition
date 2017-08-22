const {promisify,inspect} = require('util');
const fs = require('fs');
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);
const mkdir     = promisify(fs.mkdir);
const exists    = promisify(fs.exists);

const ora = require('ora');

const brotli = require('brotli');

const { FILES, DISTDIR } = require('./config');


function parse(file,visitor,context={}){
  return new Promise((resolve,reject) => {

    const p = require('node-expat').createParser();

    const stack = [visitor];
    const path = [];
    let elementText = '';

    p.on('startElement', name => {
      path.push(name);
      const v = visitor[name];

      if(v === undefined){
        p.stop();
        throw new Error('No visitor for path: ' + path.join('/'));
      } else {
        stack.push(visitor);
        visitor = v;
        elementText = '';

        if(typeof visitor._startElement === 'function'){
          visitor._startElement.call(context);
        }
      }
    });

    p.on('text', text => {
      //console.log(path.join('/',text),':',text);
      if(typeof visitor !== 'function'){
        p.stop();
        throw new Error('Visitor for path '+ path.join('/') + ' should be a function but was ' + typeof visitor);
      } else {
        elementText += text;
      }
    });

    p.on('endElement', name => {
      if(typeof visitor === 'function'){
        visitor.call(context, elementText);
      } else if (typeof visitor === 'object' && typeof visitor._endElement === 'function'){
        visitor._endElement.call(context);
      }
      visitor = stack.pop();
      path.pop();
    });

    p.on('error', err => { p.stop(); reject(err);});
    p.on('end', () => resolve(context));

    fs.createReadStream(file).pipe(p);
  });
}


function getOrAdd(value,array){

  let id = array.indexOf(value);

  if(id === -1){
    id = array.length;
    array[id] = value;
  }

  return id;
}

// Normalize to 6NF (using array index as id)
// Other variants to try:
//   - 1NF with seperate strings table
//   - BCNF
//   - 5NF
// Use https://github.com/erikolson186/relational.js or http://alasql.org/ for those
const context = {
  data: {
    Version: '',
    Grupp: {
      Namn: [],
    },
    Naringsamne: {
      Namn       : [],
      Forkortning: [],
      Enhet      : [],
    },
    Vardetyp         : [],
    Ursprung         : [],
    Publikation      : [],
    Framtagningsmetod: [],
    Metodtyp         : [],
    Referenstyp      : [],
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
  },
};


const spinner = ora().start('Transform data');
parse(FILES.Naringsvarde.xml,{
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
          this.data.Livsmedel.Grupp[this.currentFood.id] = getOrAdd(text, this.data.Grupp.Namn);
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

              const data = this.data;

              let nId = data.Naringsamne.Forkortning.indexOf(Forkortning);
              if(nId === -1){
                nId = data.Naringsamne.Forkortning.length;
                data.Naringsamne.Forkortning[nId] = Forkortning;
                data.Naringsamne.Namn       [nId] = Namn;
                data.Naringsamne.Enhet      [nId] = Enhet;
              } else {
                if(!(data.Naringsamne.Forkortning [nId] === Forkortning
                  && data.Naringsamne.Namn        [nId] === Namn
                  && data.Naringsamne.Enhet       [nId] === Enhet
                )){
                  throw new Error('Unexpected value:'+JSON.stringify({Forkortning,Namn,Enhet,Vardetyp}));
                };
              }

              const fId = this.currentFood.id;
              let nv = data.Livsmedel.Naringsvarde[Forkortning];
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
                data.Livsmedel.Naringsvarde[Forkortning] = nv;
              }
              nv.Varde             [fId] = Number(Varde);
              nv.SenastAndrad      [fId] = SenastAndrad;
              nv.Vardetyp          [fId] = getOrAdd(Ursprung,data.Vardetyp);
              nv.Ursprung          [fId] = getOrAdd(Ursprung,data.Ursprung);
              nv.Publikation       [fId] = getOrAdd(Publikation,data.Publikation);
              nv.Framtagningsmetod [fId] = getOrAdd(Framtagningsmetod,data.Framtagningsmetod);
              nv.Metodtyp          [fId] = getOrAdd(Metodtyp,data.Metodtyp);
              nv.Referenstyp       [fId] = getOrAdd(Referenstyp,data.Referenstyp);
              nv.Kommentar         [fId] = Kommentar;
            }
          },
        },
        _endElement(){
          spinner.text = this.data.Livsmedel.Namn[this.currentFood.id];
        }
      },
      _endElement(){
        spinner.succeed('Transform data');
      }
    }
  }
},context)
.then(async () => {
  spinner.start('Writing data to ' + FILES.Naringsvarde.json);
  const data = JSON.stringify(context.data/*,null,2*/);
  if(!await exists(DISTDIR)){
      await mkdir(DISTDIR);
  }
  await writeFile(FILES.Naringsvarde.json,data);
  spinner.succeed();
  spinner.start('Compressing data to ' + FILES.Naringsvarde.json + '.bro');
  await writeFile(FILES.Naringsvarde.json + '.bro', brotli.compress(await readFile(FILES.Naringsvarde.json)));
  spinner.succeed();

})
.catch(err => console.error(err));
