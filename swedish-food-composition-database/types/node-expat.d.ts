
declare module "node-expat" {

  import { Stream } from "stream";

  export class Parser extends Stream {
    parse(buf:Buffer, isFinal?: boolean): boolean
    getError(): Error
    stop(): void
    on(event: 'error', cb: (this: this, err: Error) => void): this
    on(event: 'startElement', cb: (this: this, name: string, attrs: unknown) => void): this
    on(event: 'text', cb: (this: this, text: string) => void): this
    on(event: 'endElement', cb: (this: this, name: string) => void): this
  }

  export function createParser(): Parser
}
