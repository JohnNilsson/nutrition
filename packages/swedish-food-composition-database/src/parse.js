const {Transform} = require('stream');
const expat = require('node-expat');

class XmlTransform extends Transform {

  constructor(visitor,streamOptions) {
    super(streamOptions);
    this.parser = createParser(visitor,this);
    this._error = null;
    this.parser.on('error', err => this._error = err);
  }

  _transform(chunk, encoding, callback){
    try {
      if (!this.parser.parse(chunk)) {
        this._error = this.parser.getError() || new Error('Parse failed');
      }
    } catch (e) {
      this._error = e;
    }

    if(this._error === null){
      callback();
    } else {
      this.parser.stop();
      callback(this._error);
    }
  }
}

function safe(f){
  return function(...args){
    try {
      f.call(this,...args);
    } catch (err){
      this.parser.stop();
      throw err;
    }
  };
}

function createParser(rootVisitor,context={}){
    const p = expat.createParser();

    const stack = [{
      elementName:'',
      elementText:'',
      visitor:rootVisitor,
    }];

    console.error('');

    p.on('startElement', safe(elementName => {
      const oldFrame   = stack[stack.length-1];
      const newVisitor = oldFrame.visitor[elementName];
      const newFrame = {
        elementName,
        elementText:'',
        visitor: newVisitor
      };

      if(newVisitor !== undefined){
        stack.push(newFrame);

        if(typeof newVisitor._startElement === 'function'){
          newVisitor._startElement.call(context);
        }

      } else {
        const path = stack.map(f => f.elementName).join('/');
        throw new Error('No visitor for path: ' + path);
      }
    }));

    p.on('text', safe(text => {
      const frame = stack[stack.length-1];
      if(typeof frame.visitor === 'function'){
        frame.elementText += text;
      } else {
        let path = stack.map(f => f.elementName).join('/');
        throw new Error('Visitor for path '+ path + ' should be a function but was ' + typeof visitor);
      }
    }));

    p.on('endElement', safe(elementName => {
      const frame = stack.pop();
      const v = frame.visitor;
      if(typeof v === 'function'){
        v.call(context, frame.elementText);
      } else if (typeof v === 'object' && typeof v._endElement === 'function'){
        v._endElement.call(context);
      }
    }));

    return p;
}

module.exports = { XmlTransform };
