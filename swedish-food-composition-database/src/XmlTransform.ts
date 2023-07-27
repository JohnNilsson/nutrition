import { Transform, TransformOptions, TransformCallback } from 'stream';
import { createParser as _createParser, Parser } from 'node-expat';

interface VisitorFn<T> {
  (this: T, text: string): void
}

interface VisitorObj<T> {
  [elementName:string]: VisitorObj<T> | VisitorFn<T>
}

export type Visitor<T> = VisitorObj<T> | VisitorFn<T>;


abstract class XmlTransform<T> extends Transform {

  public readonly parser: Parser
  private _error: Error | null;

  protected abstract createVisitorState(): T

  constructor(visitor: Visitor<T>, streamOptions?: TransformOptions) {
    super(streamOptions);
    this.parser = createParser(visitor,this.createVisitorState());
    this._error = null;
    this.parser.on('error', err => this._error = err);
  }

  override _transform(chunk: Buffer, encoding: string, callback: TransformCallback){
    try {
      if (!this.parser.parse(chunk)) {
        this._error = this.parser.getError() || new Error('Parse failed');
      }
    } catch (e) {
      if(e instanceof Error) {
        this._error = e;
      }
    }

    if(this._error === null){
      callback();
    } else {
      this.parser.stop();
      callback(this._error);
    }
  }
}

function safe<TS extends any[], R>(f: (this: Parser,...args: TS) => R){
  return function(this: Parser, ...args: TS){
    try {
      f.call(this,...args);
    } catch (err){
      this.stop();
      throw err;
    }
  };
}

function createParser<T>(rootVisitor: Visitor<T>, context: T){
    const p = _createParser();

    const stack = [{
      elementName:'',
      elementText:'',
      visitor:rootVisitor,
    }];

    console.error('');

    p.on('startElement', safe(elementName => {
      const oldFrame   = stack[stack.length-1]!;
      const curVisitor = oldFrame.visitor as VisitorObj<T>;
      const newVisitor = curVisitor[elementName];

      if(newVisitor !== undefined){
        const newFrame = {
          elementName,
          elementText:'',
          visitor: newVisitor
        };

        stack.push(newFrame);

        if(typeof newVisitor !== 'function' && typeof newVisitor['_startElement'] === 'function'){
          newVisitor["_startElement"].call(context, elementName);
        }

      } else {
        const path = stack.map(f => f.elementName).join('/');
        throw new Error('No visitor for path: ' + path);
      }
    }));

    p.on('text', safe(text => {
      const frame = stack[stack.length-1]!;
      if(typeof frame.visitor === 'function'){
        frame.elementText += text;
      } else {
        let path = stack.map(f => f.elementName).join('/');
        throw new Error('Visitor for path '+ path + ' should be a function but was ' + typeof frame.visitor);
      }
    }));

    p.on('endElement', safe(elementName => {
      const frame = stack.pop()!;
      const v = frame.visitor;
      if(typeof v === 'function'){
        v.call(context, frame.elementText);
      } else if (typeof v === 'object' && typeof v['_endElement'] === 'function'){
        v['_endElement'].call(context, elementName);
      }
    }));

    return p;
}

export default XmlTransform;
