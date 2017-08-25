const ora = require('ora');

const spinner = ora();

function step(text, f){
  spinner.start(text);
  try{
    const result = f();

    if(typeof result.then === 'function'){
      result.then(res => spinner.succeed());
      result.catch(res => spinner.fail());
      return result;
    }

    spinner.succeed();
    return result;
  } catch (err) {
    spinner.fail();
    throw err;
  }
}

module.exports = { spinner, step };
