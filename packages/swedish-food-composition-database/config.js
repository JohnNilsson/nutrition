const path = require('path');

const VERSION = '20170314';

const DESTDIR = 'xml';
const BASEURI = 'http://www7.slv.se/apilivsmedel/LivsmedelService.svc';

const XMLFILES = {
    Klassificering: {
        file: path.join(DESTDIR,`Klassificering-${VERSION}.xml`),
        uri: `${BASEURI}/Livsmedel/Klassificering/${VERSION}`,
    },
    Naringsvarde: {
        file: path.join(DESTDIR,`Naringsvarde-${VERSION}.xml`),
        uri: `${BASEURI}/Livsmedel/Naringsvarde/${VERSION}`,
    },
};

module.exports = {VERSION,DESTDIR,BASEURI,XMLFILES};