const test = require('tape');

const data6NF = require('../data/Naringsvarde.6NF.json');
const data5NF = require('../data/Naringsvarde.5NF.json');

// It should save some space in the json to replate "null" with "0"
test('6NF data has no missing values', assert => {
  assert.ok(typeof data6NF === 'object');
  assert.ok(typeof data6NF.Livsmedel === 'object');
  testForeignKeys(data6NF.Livsmedel,'["Livsmedel"]', assert);

  assert.end();
});

function testForeignKeys(object,path,assert) {
  for(const key of Object.keys(object)){
    const arr = object[key];
    if(Array.isArray(arr)) {
      const ix = arr.findIndex(v => v === null || v === undefined || Number.isNaN(v));
      assert.equals(ix, -1, path+'["'+key+'"] should have no missing values.'+ (ix == -1 ? '' : ' ['+ix+'] was: ' + arr[ix]));
    } else if (typeof arr === 'object') {
      testForeignKeys(arr,path+'["'+key+'"]',assert);
    }
  }
}

