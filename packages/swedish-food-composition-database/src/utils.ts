import moment from 'moment-timezone';

export function d(dateString: string){
  return moment.tz(dateString,"Europe/Stockholm").toJSON()
}

// const fmt0 = new Intl.NumberFormat('en',{minimumFractionDigits:0});
// const fmt1 = new Intl.NumberFormat('en',{minimumFractionDigits:1});
// const fmt2 = new Intl.NumberFormat('en',{minimumFractionDigits:2});
// const fmt3 = new Intl.NumberFormat('en',{minimumFractionDigits:3});
export function n(numberString: string){
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

export function nn(object:{[key:string]:string|number}){
  const nn = {} as {[key:string]:string|number};
  for(const key of Object.keys(object)){
    const value = object[key];
    if(value === undefined || value === null || value === '' || Number.isNaN(value)){
      continue;
    }
    nn[key] = value;
  }
  return nn;
}

export function setNulls<T>(arr: T[], value: T){
  for(let i = arr.length; i-- > 0;) {
    const v = arr[i];
    if(v === null || v === undefined){
      arr[i] = value;
    }
  }
}


export function id<T>(value:T|null|undefined,array:Array<T|null>) {
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


export function sortByFkFrequency(fkArr:number[],dataArr:unknown[]){
  const histogram = new Array(dataArr.length).fill(0) as number[];
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
