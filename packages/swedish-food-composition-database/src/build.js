const download = require('./download-xml');
const transform = require('./transform');
const compress = require('./compress-json');

download()
.then(transform)
.then(compress)
.catch(err => console.error(err));
