const test = require('tape');
const { d, id } = require('./utils');

test('id gets index of existing value', assert => {
  const val1 = 'test value 1';
  const val2 = 'test value 2';
  const val3 = 'test value 3';
  const arr  = [val1,val2,val3];

  const ix = id(val2,arr);

  assert.equals(ix,1);

  assert.end();
});

test('id add, and gets gets index of missing value', assert => {
  const val1 = 'test value 1';
  const val2 = 'test value 2';
  const val3 = 'test value 3';
  const arr  = [val1,val2,val3];

  const val4 = 'test value 4';

  const ix = id(val4,arr);

  assert.equals(ix,3);
  assert.deepEquals(arr,[val1,val2,val3,val4]);

  assert.end();
});

test('id gets index of null', assert => {
  const val1 = 'test value 1';
  const val2 = 'test value 2';

  const arr = [val1, null, val2];

  const ix = id(null,arr);

  assert.equals(ix, 1);
  assert.deepEquals(arr, [val1,null,val2]);

  assert.end();
});

test('id gets index of null for undefined', assert => {
  const val1 = 'test value 1';
  const val2 = 'test value 2';

  const arr = [val1, val2];

  const ix = id(undefined,arr);

  assert.equals(ix, 2);
  assert.deepEquals(arr, [val1,val2,null]);

  assert.end();
});
