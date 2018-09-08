const test = require('tape');

const {setNulls} = require('./utils');

const data6NF = require('../data/Naringsvarde.6NF.json');

for(const key of Object.keys(data6NF.Livsmedel.Naringsvarde)){
  setNulls(data6NF.Livsmedel.Naringsvarde[key].Varde,NaN);
}

test('Group is array', assert => {

  assert.ok(Array.isArray(data6NF.Grupp));

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
