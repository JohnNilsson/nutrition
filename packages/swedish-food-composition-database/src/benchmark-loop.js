var Benchmark = require('benchmark');

const setup = {
  setup(){
    const arr = new Array(10000).fill(1);
  }
};

(new Benchmark.Suite)
.add('loop forwards .length', function() {
  for(let i = 0; i < arr.length; i++){
    arr[i] = 0;
  }
},setup)
.add('loop forwards cached length', function() {
  for(let i = 0, l = arr.length; i < l; i++){
    arr[i] = 0;
  }
},setup)
.add('loop backwards explicit test', function() {
  for(let i = arr.length; i-->0;){
    arr[i] = 0;
  }
},setup)
.add('loop backwards implicit test', function() {
  for(let i = arr.length; i--;){
    arr[i] = 0;
  }
},setup)
.on('cycle', function (event) {
  console.log(String(event.target));
})
.on('complete', function() {
  console.log('Fastest is ' + this.filter('fastest').map('name'));
  // const {inspect} = require('util');
  // console.log(inspect(this));
})
.run();
