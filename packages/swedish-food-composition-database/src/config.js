const path = require('path');

const VERSION = '20170314';

const XMLDIR  = 'xml';
const DISTDIR = 'dist';
const BASEURI = 'http://www7.slv.se/apilivsmedel/LivsmedelService.svc';

const FILES = {
    Klassificering: {
        xml: path.join(XMLDIR,`Klassificering-${VERSION}.xml`),
        uri: `${BASEURI}/Livsmedel/Klassificering/${VERSION}`,
        json: {
          ['6NF']: path.join(DISTDIR,`Klassificering-${VERSION}.6NF.json`),
        }
    },
    Naringsvarde: {
        xml: path.join(XMLDIR,`Naringsvarde-${VERSION}.xml`),
        uri: `${BASEURI}/Livsmedel/Naringsvarde/${VERSION}`,
        json: {
          ['6NF']: path.join(DISTDIR,`Naringsvarde-${VERSION}.6NF.json`),
        },
    },
};

module.exports = {VERSION,XMLDIR,DISTDIR,BASEURI,FILES};
