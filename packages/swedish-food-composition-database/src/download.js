const fs = require('fs');
const path = require('path');
const download = require('download');
const ProgressBar = require('progress');

const { FILES } = require('./config');

Object.keys(FILES).map(name =>{
    const file = FILES[name];
    const uri = file.uri;
    const dst = file.xml;

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
