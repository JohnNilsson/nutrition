# Random design notes

## Thoughts

support various sources (databases and studies) of claims the nutritional content of foods can be expressed as ranges rather than points claims can be aggregated in various ways (min,max) to derive the final number cliams can be debated by the community and it's confidence can be determined by voting claims can be replaced by other claims

foods can be simple, or composite. A composite food might be a product with mixed greens.

Recipies, could be seen as a composite in their own right. But I think recpies are rather mapping of foods to servings, a seperate thing, after the list of foods has been decided (recipies might add foods to the list though)

## Interesting studies

[Kerndt, Peter R. et al. “Fasting: The History, Pathophysiology and Complications.” _Western Journal of Medicine_ 137.5 (1982): 379–399. Print.](https://www.ncbi.nlm.nih.gov/pmc/articles/PMC1274154/pdf/westjmed00207-0055.pdf)

## Architecture

To avoid costs of backend hosting the first version will be read only data will be compiled into loadable modules on build and debates on nutritional facts will be handled as pull requests on github.

User profiles will be save as localStorage, or url-data for bookmarking.

A future version will add it's own backend for user profiles and the fact gathering aspects

## Libs

### UI

http://react-toolbox.com/#/
http://blueprintjs.com/
https://react.semantic-ui.com/

https://kea.js.org/
http://cerebraljs.com/docs/introduction/
https://github.com/MicheleBertoli/css-in-js

### Storage, query and sync

https://github.com/google/lovefield
https://pouchdb.com/
http://dexie.org/
http://lokijs.org/
https://github.com/thestorefront/DataCollection.js
http://staypositive.ru/sklad/
http://dev.yathit.com/ydn-db/
http://www.defiantjs.com/
https://www.npmjs.com/package/nano-sql

https://github.com/erikolson186/relational.js
http://alasql.org/

https://github.com/ipfs/js-ipfs
https://ipfs.io/blog/30-js-ipfs-crdts.md
https://github.com/orbitdb/orbit-db

http://y-js.org/

### Serialization

http://msgpack.org/
https://github.com/msgpack/msgpack-node
http://dcode.io/protobuf.js/
https://github.com/mapbox/pbf
https://github.com/mtth/avsc
https://github.com/google/flatbuffers
https://github.com/phretaddin/schemapack
https://github.com/dcodeIO/PSON
http://cbor.io/
https://github.com/hildjj/node-cbor
https://github.com/dignifiedquire/borc
https://github.com/wavesoft/jbb
http://ubjson.org/#why
https://github.com/FasterXML/smile-format-specification
https://capnproto.org/

https://eng.uber.com/trip-data-squeeze/

### Compression

https://github.com/kesla/node-snappy
https://github.com/zhipeng-jia/snappyjs

https://github.com/MayhemYDG/iltorb
https://github.com/devongovett/brotli.js

https://github.com/Topface/node-lzf
https://github.com/McSimp/lzfjs

https://github.com/LZMA-JS/LZMA-JS

### Nutritinal data

http://qualify.pohodesign.cz/
https://quisper.eu/

https://github.com/nutritionix
https://spoonacular.com/food-api
https://github.com/teamtofu/foodweb
https://github.com/eliashussary/nutrition-facts
https://github.com/asbaker/node-fda-nutrient-database

### Nutrition

http://www.lakareforframtiden.se/
http://healthfully.org/

### Random

https://chainpoint.org/
https://github.com/monarch-initiative/SEPIO-ontology
http://foodontology.github.io/foodon/
http://www.langual.org/
http://www.langual.org/download/Presentation/LanguaLpresentation%202015-10-04.pdf
https://github.com/monarch-initiative/SEPIO-ontology
https://github.com/FoodOntology/foodon
