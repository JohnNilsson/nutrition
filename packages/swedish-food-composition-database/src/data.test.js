const test = require('tape');

const {setNulls} = require('./utils');

const data6NF = require('../data/Naringsvarde.6NF.json');
const data5NF = require('../data/Naringsvarde.5NF.json');

for(const key of Object.keys(data6NF.Livsmedel.Naringsvarde)){
  setNulls(data6NF.Livsmedel.Naringsvarde[key].Varde,NaN);
}

test('Group is array', assert => {

  assert.ok(Array.isArray(data6NF.Grupp));
  assert.ok(Array.isArray(data5NF.Grupp));

  assert.end();
});


test('6NF data has no missing values', assert => {
  assert.ok(typeof data6NF === 'object');
  assert.ok(typeof data6NF.Livsmedel === 'object');
  testForeignKeys(data6NF.Livsmedel,'["Livsmedel"]', assert);

  assert.end();
});

function testForeignKeys(object,path,assert) {
  for(const key of Object.keys(object)){
    const arr = object[key];
    if(key === 'Varde'){
      continue;
    }
    if(Array.isArray(arr)) {
      const ix = arr.findIndex(v => v === null || v === undefined);
      assert.equals(ix, -1, path+'["'+key+'"] should have no missing values.'+ (ix == -1 ? '' : ' ['+ix+'] was: ' + arr[ix]));
    } else if (typeof arr === 'object') {
      testForeignKeys(arr,path+'["'+key+'"]',assert);
    }
  }
}


test('6NF data validates agains avro-schema', assert => {
  const avro = require('avsc');
  const type = avro.Type.forSchema(require('./Naringsvarde.6NF.avro-schema.json'));
  console.error('Current value Livsmedel,Naringsvarde,I,Varde,0 = ',data6NF.Livsmedel.Naringsvarde.I.Varde[0]);
  assert.ok(type.isValid(data6NF,{
    errorHook(path, any, type){
      const util = require('util');
      throw new Error(util.format('invalid %s: %j', path.join(), any));
      //console.error(path,any,type);
    },
    noUndeclaredFields: true
  }));

  assert.end();
});
