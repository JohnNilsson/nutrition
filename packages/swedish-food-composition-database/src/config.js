const path = require('path');

const VERSION = '20170314';

const XMLDIR  = 'xml';
const DISTDIR = 'dist';
const BASEURI = 'http://www7.slv.se/apilivsmedel/LivsmedelService.svc';

const FILES = {
    Klassificering: {
        xml: path.join(XMLDIR,`Klassificering-${VERSION}.xml`),
        uri: `${BASEURI}/Livsmedel/Klassificering/${VERSION}`,
        json: path.join(DISTDIR,`Klassificering-${VERSION}.json`),
    },
    Naringsvarde: {
        xml: path.join(XMLDIR,`Naringsvarde-${VERSION}.xml`),
        uri: `${BASEURI}/Livsmedel/Naringsvarde/${VERSION}`,
        json: path.join(DISTDIR,`Naringsvarde-${VERSION}.json`),
    },
};

module.exports = {VERSION,XMLDIR,DISTDIR,BASEURI,FILES};