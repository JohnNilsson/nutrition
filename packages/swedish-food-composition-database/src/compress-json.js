const {compress} = require('brotli');
const {promisify} = require('util');
const fs = require('fs');
const writeFile = promisify(fs.writeFile);
const readFile  = promisify(fs.readFile);

const {step} = require('./ui');
const { FILES } = require('./config');

async function compressJson(){
  const file = FILES.Naringsvarde.json['6NF'];
  await step('Compressing data to ' + file + '.bro', async () => {
    await writeFile(file + '.bro', compress(await readFile(file)));
  });
};

module.exports = compressJson;
