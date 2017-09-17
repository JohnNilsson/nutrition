const moment = require('moment-timezone');

function d(dateString){
  return moment.tz(dateString,"Europe/Stockholm").toJSON()
}

const fmt0 = new Intl.NumberFormat('en',{minimumFractionDigits:0});
const fmt1 = new Intl.NumberFormat('en',{minimumFractionDigits:1});
const fmt2 = new Intl.NumberFormat('en',{minimumFractionDigits:2});
const fmt3 = new Intl.NumberFormat('en',{minimumFractionDigits:3});
function n(numberString){
  const val = Number(numberString.replace(',','.').replace(/\s/,''));

  // const s0 = fmt0.format(val).replace(',','\u00a0').replace('.',',');
  // const s1 = fmt1.format(val).replace(',','\u00a0').replace('.',',');
  // const s2 = fmt2.format(val).replace(',','\u00a0').replace('.',',');
  // const s3 = fmt3.format(val).replace(',','\u00a0').replace('.',',');
  // if(s0 !== numberString && s1 !== numberString && s2 !== numberString && s3 !== numberString){
  //   throw new Error(s1 + ' or ' + s2 + ' or ' + s3 + ' or ' + s4 + ' != ' + numberString + ' (' + Array.from(numberString).map(c => c.codePointAt(0)).join('|') + ')');
  // }

  return val;
}

function nn(object){
  const nn = {};
  for(const key of Object.keys(object)){
    const value = object[key];
    if(value === undefined || value === null || value === '' || Number.isNaN(value)){
      continue;
    }
    nn[key] = value;
  }
  return nn;
}

function setNulls(arr,value){
  for(let i = arr.length; i-- > 0;) {
    const v = arr[i];
    if(v === null || v === undefined){
      arr[i] = value;
    }
  }
}


function id(value,array) {
  if(value === undefined){
    value = null;
  }

  let id = array.indexOf(value);

  if(id === -1){
    id = array.length;
    array[id] = value;
  }

  return id;
}

function sortByFkFrequency(fkArr,dataArr){
  const histogram = new Array(dataArr.length).fill(0);
  for(let i = fkArr.length; i-->0;){
    const key = fkArr[i];
    histogram[key]++;
  }

  const newDataOrder = histogram.map((freq,oldKey) => ({ freq, oldKey, data: dataArr[oldKey] }));
  newDataOrder.sort((a,b) =>  b.freq - a.freq);

  const keyMap = new Array(dataArr.length);
  for(let i = newDataOrder.length; i-->0;){
    const { oldKey, data } = newDataOrder[i];
    const newKey = i;
    keyMap[oldKey] = newKey;
    dataArr[newKey] = data;
  }

  for(let i = fkArr.length; i-->0;){
    const oldKey = fkArr[i];
    const newKey = keyMap[oldKey];
    fkArr[i] = newKey;
  }
}

module.exports = {setNulls,nn,n,d,id,sortByFkFrequency};
