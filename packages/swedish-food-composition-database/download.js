const fs = require('fs');
const path = require('path');
const download = require('download');
const ProgressBar = require('progress');

const { XMLFILES } = require('./config');

Object.keys(XMLFILES).map(name =>{
    const xml = XMLFILES[name];
    const uri = xml.uri;
    const dst = xml.file;

    if(fs.existsSync(dst)){
        console.log(`Exists ${dst}`);
        return;
    }
    
    download(uri)
    .on('response', res => {
        const len = parseInt(res.headers['content-length'], 10);
        const bar = new ProgressBar(`Downloading [:bar]: ${dst}`, {
            complete: '=',
            incomplete: ' ',
            width: 20,
            total: len
        });
        res.on('data', chunk => bar.tick(chunk.length));
    })
    .pipe(fs.createWriteStream(dst));
});
