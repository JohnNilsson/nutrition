const test = require('blue-tape');
const util = require('util');
const fs   = require('fs');
const readFile = util.promisify(fs.readFile);



test('6NF protobuf db matches xml data', async assert => {
  const [xmlDb, protoDb] = await Promise.all([readXmlDb(),readProtoDb()]);
  for(const livsmedel of xmlDb.LivsmedelDataset.LivsmedelsLista.Livsmedel){
    validateLivsmedel(livsmedel,protoDb,assert);
  }
});



function validateLivsmedel(livsmedel,protoDb,assert){
  const {
    Nummer,
    Namn,
    ViktGram,
    Huvudgrupp,
    Naringsvarden,
  } = livsmedel;
  const id = protoDb.Livsmedel.Nummer.indexOf(Number(Nummer));

  assert.ok(Number.isInteger(id) && id >= 0);
  assert.equal(String(protoDb.Livsmedel.Nummer [id]), Nummer);
  assert.equal(protoDb.Livsmedel.Namn   [id], Namn);
  assert.equal(protoDb.Grupp[protoDb.Livsmedel.Grupp[id]],  Huvudgrupp);

  for(const naringsvarde of Naringsvarden.Naringsvarde){
    validateNaringsvarde(id,naringsvarde,protoDb,assert);
  }

}

function validateNaringsvarde(id,naringsvarde,protoDb,assert){
  const {
    Namn,
    Forkortning,
    Varde,
    Enhet,
    SenastAndrad,
    Vardetyp,
    Ursprung,
    Publikation,
    Framtagningsmetod,
    Metodtyp,
    Referenstyp,
    Kommentar,
  } = naringsvarde;


}


async function readXmlDb(){
  const xml = await readFile(__dirname + '/../data/Naringsvarde.xml');
  const parseXml = util.promisify(new (require('xml2js')).Parser({explicitArray: false, ignoreAttrs: true}).parseString);
  return await parseXml(xml);
}


async function readProtoDb(){
  let buf = await readFile(__dirname + '/../data/Naringsvarde.6NF.proto.brotli');
  buf = require('brotli/decompress')(buf);
  const {LivsmedelsDatabasen} = require('./Naringsvarde.6NF.proto.js');
  return LivsmedelsDatabasen.decode(buf);
}
