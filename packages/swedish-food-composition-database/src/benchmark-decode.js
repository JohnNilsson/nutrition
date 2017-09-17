var Benchmark = require('benchmark');

function read(file){
  const fs  = require('fs');
  const buf = fs.readFileSync(file);
  return buf;
}

const decompress = {
  "": function(buf){
    return buf;
  },
  brotli: function(buf){
    return require('brotli/decompress')(buf);
  }
};

const decode = {
  json: function(buf,schema){
    return JSON.parse(buf);
  },
  proto: function(buf,schema){
   const {LivsmedelsDatabasen} = require(schema);
   return LivsmedelsDatabasen.decode(buf);
  },
  avro: function(buf,schema){
    const avro = require('avsc');
    const type = avro.Type.forSchema(require(schema));
    return type.fromBuffer(buf);
  }
};

function benchmark({file,compresison='',encoding='',schema=''}){
  return function(){
    const fs  = require('fs');
    let buf = fs.readFileSync(file);
    buf = decompress[compresison](buf);
    buf = decode[encoding];
  };
}

const transforms   = ['6NF','5NF'];
const compressions = Object.keys(decompress);
const encodings    = Object.keys(decode);

const suite = new Benchmark.Suite;

for(const compression of compressions){
  for(const encoding of encodings){
    for(const transform of transforms){
      //console.log('Construct',compression,encoding,transform);
      const name = compression
        ? `${compression} compressed ${encoding} ${transform}`
        : `uncompressed ${encoding} ${transform}`
      const file = compression
        ?`../data/Naringsvarde.${transform}.${encoding}.${compression}`
        :`../data/Naringsvarde.${transform}.${encoding}`;
      const schema =
        encoding == 'avro'  ? `./Naringsvarde.${transform}.avro-schema.json` :
        encoding == 'proto' ? `./Naringsvarde.${transform}.proto.js` :
        '';
      //console.log({file,compression,encoding,schema});
      suite.add(name,benchmark({file,compression,encoding,schema}));
    }
  }
}

suite
.on('error', function(event){
  console.log('Error in',event.target.name);
  console.log(event.target.error);
})
.on('cycle', function(event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
  // const {inspect} = require('util');
  // console.log(inspect(this));
})
.run();

