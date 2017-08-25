const fs = require('fs');
const {promisify} = require('util');
const exists = promisify(fs.exists);
const MultiProgress = require('multi-progress');
const multi = new MultiProgress(process.stderr);
const download = require('download');
const { FILES } = require('./config');

function downloadXml(){
  console.log('Downloading XML');
  return Promise.all(Object.keys(FILES).map(name =>
      downloadIfMissing(FILES[name])));
}

async function downloadIfMissing({uri,xml},log){
  if(!await exists(xml)){
    await new Promise((resolve,reject) => {
      download(uri)
      .on('response', res => createProgressBar(res,xml))
      .pipe(fs.createWriteStream(xml))
      .on('finish', resolve)
      .on('error', reject);
    });
  } else {
    console.log(xml,'cached');
  }
}

function createProgressBar(res,msg){
  const len = parseInt(res.headers['content-length'], 10);
  const bar = multi.newBar(` - [:bar] ${msg}`, {
    complete: '=',
    incomplete: ' ',
    width: 30,
    total: len,
  });
  res.on('data', chunk => bar.tick(chunk.length));
}

module.exports = downloadXml;
